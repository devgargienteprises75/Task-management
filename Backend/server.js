import app from "./src/app.js";
import 'dotenv/config'
import connectToDb from "./src/config/database.js";

const PORT = process.env.PORT || 8000

connectToDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server connecting to port: ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
        process.exit(1)
    })