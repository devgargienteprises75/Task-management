import cron from "node-cron";
import { taskModel } from "../models/task.model.js";
import { sendPushToUser } from "./push.service.js";

export const initializeCronJobs = () => {
    cron.schedule('0 12 * * *', async () => {
        console.log("Running Daily Deadline checker");

        try {
            const now = new Date();
            const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

            const tasksDueToday = await taskModel.find({
                dueDate: todayUTC,
                status: { $ne: "Done"},
                reminderSent: false
            });

            if(!tasksDueToday){
                console.log("No pending tasks due today.");
                return 
            }

            for(const task of tasksDueToday){
                for(const assignee of task.assignTo){
                    await sendPushToUser(assignee.toString(), {
                        title: "Deadline Today! ⏰",
                        body: `Action required: Your task "${task.title}" is due today. Please complete it before the end of the day.`,
                        url: `/workspaces/${task.workspaceId}`
                    })
                }

                await sendPushToUser(task.assignBy.toString(), {
                    title: "Task Deadline Reached ⚠️",
                    body: `Status update: The task "${task.title}" you assigned is due today and is still pending completion.`,
                    url: `/workspaces/${task.workspaceId}`
                })

                task.reminderSent = true;
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