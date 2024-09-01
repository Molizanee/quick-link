// src/config/firebase.ts

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as dotenv from "dotenv";

dotenv.config();

const serviceAccountKeys = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const bucketUrl = process.env.FIREBASE_BUCKET_URL;

if (!serviceAccountKeys || !bucketUrl) {
	console.error(
		"Please provide FIREBASE_SERVICE_ACCOUNT_KEY and FIREBASE_BUCKET_URL in .env file",
	);
	process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKeys);

initializeApp({
	credential: cert(serviceAccount),
	storageBucket: bucketUrl,
});

export const db = getFirestore();
export const storage = getStorage();
