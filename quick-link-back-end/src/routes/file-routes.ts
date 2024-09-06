import { Router } from "express";
import {
	uploadFileController,
	downloadFileController,
} from "@/controllers/file-controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/upload", upload.single("file"), uploadFileController);
router.get("/download/:id", downloadFileController);

export default router;
