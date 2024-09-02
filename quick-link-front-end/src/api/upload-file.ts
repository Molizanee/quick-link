import { axiosInstance } from "./axios";

type UploadFileResponse = {
	id: string;
};

export const uploadFile = async (file: Blob, ipAdress: string) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("ip_address", ipAdress);

		const response = await axiosInstance.post("/files/create-file", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data as UploadFileResponse;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
};
