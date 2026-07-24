import app, { initGeneralWorkspace } from "./src/app.js";
import 'dotenv/config'
import connectToDb from "./src/config/database.js";
import { config } from "./src/config/config.js";

const PORT = config.PORT || 8000

connectToDb()
    .then(async () => {
        await initGeneralWorkspace()
        app.listen(PORT, () => {
            console.log(`Server connecting to port: ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
        process.exit(1)
    })