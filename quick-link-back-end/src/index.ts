import express, { type Request, type Response } from "express";
import fileRoutes from "./routes/file-routes";
// import deleteFiles from "./utils/cleanup-files";

import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3333;

app.use(
	cors({
		origin: "http://localhost:5173", // Replace with your front-end URL
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true, // If you need to allow cookies or HTTP authentication
	}),
);

app.use(express.json());
app.use("/files", fileRoutes);

// setInterval(deleteFiles, 10 * 60 * 1000);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
