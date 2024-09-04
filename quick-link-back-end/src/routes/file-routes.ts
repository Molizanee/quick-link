import { Router } from "express";
import {
	createFile,
	// deleteFile,
	downloadFile,
	getFileDetails,
} from "../controllers/file-controller";

const router = Router();

router.post("/create-file", createFile);
router.get("/get-file/:id", getFileDetails);
router.get("/download-file/:id", downloadFile);
// router.post("/delete-file/:id", deleteFile);

export default router;
