import cron from "node-cron";
import { taskModel } from "../models/task.model.js";
import { sendPushToUser } from "./push.service.js";
import { userModel } from "../models/user.model.js";

const reminderSchedule = async ({ hour }) => {
    cron.schedule(`0 ${hour} * * *`, async () => {
        console.log("Running Daily Deadline checker");

        try {
            const now = new Date();
            const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

            const tasksDueToday = await taskModel.find({
                dueDate: todayUTC,
                status: { $ne: "Done" },
                reminderSentCount: {
                    $lt: 2
                }
            });

            if (tasksDueToday.length === 0) {
                console.log("No pending tasks due today.");
                return
            }

            for (const task of tasksDueToday) {
                for (const assignee of task.assignTo) {
                    await sendPushToUser(assignee.toString(), {
                        title: "Deadline Today! ⏰",
                        body: `Action required: Your task "${task.title}" is due today. Please complete it before the end of the day.`,
                        url: `/workspaces/${task.workspaceId}`
                    })
                }

                const user = await userModel.findById(task.assignTo[0])

                await sendPushToUser(task.assignBy.toString(), {
                    title: "Task Deadline Reached ⚠️",
                    body: `Status update: The task "${task.title}" you assigned to ${user?.username || 'someone'} which deadline is today and is still pending completion.`,
                    url: `/workspaces/${task.workspaceId}`
                })

                task.reminderSentCount += 1;
                await task.save();
            }

            console.log(`Successfully sent reminder for ${tasksDueToday.length} tasks.`);

        } catch (err) {
            console.error(`Error runnign deadline cron job: ${err}`)
        }

    }, {
        schedule: true,
        timezone: "Asia/Kolkata"
    })
}

export const initializeCronJobs = () => {
    reminderSchedule({ hour: 12 })
    reminderSchedule({ hour: 18 }) // 6:00 PM
}