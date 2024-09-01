import { axiosInstance } from "./axios";

export const getFile = async (id: string) => {
	try {
		const response = await axiosInstance.get(`/files/get-file/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error getting file:", error);
		throw error;
	}
};
