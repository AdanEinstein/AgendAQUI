import axios from "axios";
import { profileEnv } from "./baseUrl";

export default async function auth(): Promise<boolean> {
	const token = localStorage.getItem("token");
	try {
		await axios.get(`${profileEnv.baseUrlJava}/api/login/token`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return true;
	} catch (error) {
		return false;
	}
}
