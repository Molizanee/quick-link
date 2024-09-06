import crypto from "node:crypto";

export const encryptFile = (file: Buffer, secretKey: string) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv("aes-256-ctr", secretKey, iv);

	const encryptedFile = Buffer.concat([cipher.update(file), cipher.final()]);
	return { encryptedFile, iv };
};

export const decryptFile = (
	encryptedFile: Buffer,
	secretKey: string,
	iv: string,
) => {
	const decipher = crypto.createDecipheriv(
		"aes-256-ctr",
		secretKey,
		Buffer.from(iv, "hex"),
	);
	const decryptedFile = Buffer.concat([
		decipher.update(encryptedFile),
		decipher.final(),
	]);
	return decryptedFile;
};
