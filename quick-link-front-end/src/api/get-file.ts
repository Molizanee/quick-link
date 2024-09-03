import { axiosInstance } from "./axios";

type GetFileResponse = {
	id: string;
	createdAt: string;
	file_url: string;
	ip_address: string;
};

export const getFile = async (id: string) => {
	const response = await axiosInstance.get<GetFileResponse>(
		`/files/get-file/${id}`,
	);
	if (response.status === 204) {
		return "File not found";
	}
	return response.data;
};
