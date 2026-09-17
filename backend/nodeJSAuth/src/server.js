import app from "./app.js";
import { connectDb } from "./config/db.js";
import dns from "dns";
const port = process.env.PORT || 5000;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const startServer = async () => {
    try {
        await connectDb();

        app.listen(port, "0.0.0.0", () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();