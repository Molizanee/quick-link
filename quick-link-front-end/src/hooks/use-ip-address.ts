import { useEffect, useState } from "react";

export function useIpAddress() {
	const [ipAddress, setIpAddress] = useState("");

	useEffect(() => {
		const fetchIpAddress = async () => {
			try {
				const response = await fetch("https://api.ipify.org?format=json");
				const data = await response.json();
				setIpAddress(data.ip);
			} catch (error) {
				console.error("Error fetching the IP address:", error);
			}
		};

		fetchIpAddress();
	}, []);

	return ipAddress as string;
}
