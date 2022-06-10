import styles from "./FormLogin.module.css";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import Link from "next/link";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import { profileEnv } from "../../auth/baseUrl";

const FormLogin: React.FC = () => {
	const [feedback, setFeedback] = useState<IFeedback>({
		icon: "bi bi-info-circle",
		message: "Digite corretamente as informações",
		color: "text-primary",
	});
	const [loading, setLoading] = useState<boolean>(false);
	const loginRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const handleEntrar = useCallback(() => {
		setLoading(true);
		const login = loginRef.current.value;
		const password = passwordRef.current.value;
		if (login === "") {
			setFeedback({
				icon: "bi bi-exclamation-triangle",
				message: "Preencha o campo o login!",
				color: "text-danger",
			});
			setLoading(false);
		} else if (password === "") {
			setFeedback({
				icon: "bi bi-exclamation-triangle",
				message: "Preencha o campo de senha!",
				color: "text-danger",
			});
			setLoading(false);
		} else {
			axios
				.post(`${profileEnv.baseUrl}/gettoken`, {
					login,
					password,
				})
				.then((token) => {
					if (token.status === 200) {
						localStorage.setItem("token", token.data);
						setFeedback({
							icon: "bi bi-check-circle",
							message: "Login válido",
							color: "text-success",
						});
						setLoading(false);
					} else {
						setFeedback({
							icon: "bi bi-exclamation-diamond-fill",
							message: token.data,
							color: "text-warning",
						});
						setLoading(false);
					}
				})
				.catch((err: AxiosError) => {
					setFeedback({
						icon: "bi bi-exclamation-diamond-fill",
						message: "Informações inválidas!",
						color: "text-warning",
					});
					setLoading(false);
				});
		}
	}, [loginRef, passwordRef]);

	useEffect(() => {
		localStorage.removeItem("token");
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
							disabled={loading}
						/>
					</FloatingLabel>
					<FloatingLabel label="Senha">
						<Form.Control
							type="password"
							placeholder="Senha"
							ref={passwordRef}
							disabled={loading}
						/>
					</FloatingLabel>
					<FeedbackText feedback={feedback} />
					{loading ? (
						<Button className="w-100" disabled>
							Loading...
						</Button>
					) : (
						<>
							<Button
								className="w-100 mb-3"
								onClick={handleEntrar}
							>
								Entrar
							</Button>
							<Link href="/cadastro">
								<a className="btn btn-sm btn-outline-warning">
									Registre-se aqui!
								</a>
							</Link>
						</>
					)}
				</Form>
			</div>
		</div>
	);
};

export default FormLogin;
