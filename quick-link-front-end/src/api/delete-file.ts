import { axiosInstance } from "./axios";

export const DeleteFile = async (id: string) => {
	try {
		const response = await axiosInstance.delete(`/files/delete-file/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
};
