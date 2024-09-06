import express, { type Request, type Response } from "express";
import fileRoutes from "./routes/file-routes";
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());
app.use("/files", fileRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
