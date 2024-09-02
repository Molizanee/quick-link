import { axiosInstance } from "./axios";

type GetFileResponse = {
	id: string;
	createdAt: string;
	file_url: string;
	ip_address: string;
};

export const getFile = async (id: string) => {
	try {
		const response = await axiosInstance.get(`/files/get-file/${id}`);
		return response.data as GetFileResponse;
	} catch (error) {
		console.error("Error getting file:", error);
		throw error;
	}
};
