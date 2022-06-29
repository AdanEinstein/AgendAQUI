import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { profileEnv } from "./baseUrl";

export default async function useAuth() {
    const route = useRouter()
	const token = localStorage.getItem("token");

	useEffect(() => {
		axios
			.get(`${profileEnv.baseUrlJava}/api/login/token`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(() => {
				return;
			})
			.catch(() => {
				route.push("/not_found");
			});
	}, []);
}
