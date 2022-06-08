import styles from "./FormLogin.module.css";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosPromise, AxiosResponse } from "axios";

interface IFeedback {
	icon?: string;
	message: string;
	color: string;
}

const FormLogin: React.FC = () => {
	const [feedback, setFeedback] = useState<IFeedback>({
		icon: "bi bi-info-circle",
		message: "Digite corretamente as informações",
		color: "text-primary",
	});
	const loading = useRef<boolean>(false)
	const loginRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const handleEntrar = useCallback(async () => {
		loading.current = true;
		try {
			const login = loginRef.current.value;
			const password = passwordRef.current.value;

			const token = await axios.post<AxiosPromise, AxiosResponse<string>>(
				"https://sistema-agendaqui.vercel.app/api/gettoken",
				{ login, password }
			);
			if (token.status == 200) {
				localStorage.setItem("token", token.data);
				setFeedback({
					icon: "bi bi-check-circle",
					message: "Login válido",
					color: "text-success",
				});
				loading.current = false;
			} else {
				setFeedback({
					icon: "bi bi-exclamation-triangle",
					message: "Informações inválidas!",
					color: "text-danger",
				});
				loading.current = false;
			}
		} catch (error) {
			setFeedback({
				icon: "bi bi-exclamation-diamond-fill",
				message: "Estamos com um problema, mais tarde!",
				color: "text-warning",
			});
			loading.current = false;
		}
	}, [loginRef, passwordRef]);

	useEffect(() => {
		localStorage.clear()
		loginRef.current.focus();
	}, []);

	return (
		<div className={styles.FormLogin + " container"}>
			<div className="col-lg-6 col-md-8 col-12">
				<h2 className="d-md-block d-none">
					Bem vindo! Faça o seu login aqui
				</h2>
				<h2 className="d-md-none d-block">Faça o seu login aqui!</h2>
				<Form>
					<FloatingLabel label="Login" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Login"
							ref={loginRef}
						/>
					</FloatingLabel>
					<FloatingLabel label="Senha">
						<Form.Control
							type="password"
							placeholder="Senha"
							ref={passwordRef}
						/>
					</FloatingLabel>
					<div className="my-3">
						<i
							className={feedback?.icon + " " + feedback.color}
						></i>
						<span className={feedback.color}>
							{" "}
							{feedback.message}
						</span>
					</div>
					{loading.current ? (
						<Button className="w-100" disabled>
							Loading...
						</Button>
					) : (
						<Button
							className="w-100"
							onClick={handleEntrar}
						>
							Entrar
						</Button>
					)}
				</Form>
			</div>
		</div>
	);
};

export default FormLogin;
