import crypto from "node:crypto";

// Generate a new encryption key and IV for symmetric encryption (AES-256-CBC)
const generateNewKeys = () => {
	// Generate a 256-bit key (32 bytes)
	const key = crypto.randomBytes(32).toString("base64");

	// Generate a 128-bit IV (16 bytes)
	const iv = crypto.randomBytes(16).toString("base64");

	console.log("Key:", key);
	console.log("IV:", iv);
};

generateNewKeys();
