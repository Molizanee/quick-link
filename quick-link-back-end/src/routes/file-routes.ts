import { Router } from "express";
import {
	createFile,
	deleteFile,
	getFile,
} from "../controllers/file-controller";

const router = Router();

router.post("/create-file", createFile);
router.get("/get-file/:id", getFile);
router.post("/delete-file/:id", deleteFile);

export default router;
