import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { profileEnv } from "./baseUrl";

export default function useAuth() {
	const [auth, setAuth] = useState<boolean>(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		axios
			.get(`${profileEnv.baseUrl}/validToken`, {
				headers: { Authorization: token },
			})
			.then(() => {
                setAuth(true)
            })
			.catch(() => {
                setAuth(false)
            });
	}, []);

    return auth
}
