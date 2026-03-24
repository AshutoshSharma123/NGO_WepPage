import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedDatabase } from "./utils/seedData.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    await seedDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
