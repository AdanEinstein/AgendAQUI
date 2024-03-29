import styles from "./FormLogin.module.css";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import { profileEnv } from "../../auth/baseUrl";
import * as yup from "yup";
import { useRouter } from "next/router";

yup.setLocale({
	mixed: {
		required(params) {
			return `${params.path} não foi preenchido!`;
		},
	},
});

const schema = yup.object().shape({
	password: yup.string().required().label("Senha"),
	login: yup.string().required().label("Login"),
});

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-primary",
};

const FormLogin: React.FC = () => {
	const route = useRouter()
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
	const [loading, setLoading] = useState<boolean>(false);
	const loginRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const handleEntrar = useCallback(() => {
		setLoading(true);
		const user = {
			login: loginRef.current.value,
			password: passwordRef.current.value,
		};
		schema
			.validate(user)
			.then(() => {
				setFeedback(feedbackDefault);
			})
			.then(() => {
				axios
					.post(`${profileEnv.baseUrl}/gettoken`, user)
					.then((token) => {
						if (token.status === 200) {
							localStorage.setItem("token", token.data);
							axios.post(`${profileEnv.baseUrl}/getuser`, {login: user.login, senha: user.password}, {
								headers: {Authorization: `Bearer ${token.data}`}
							}).then(data => {
								localStorage.setItem("user", JSON.stringify(data.data))
							}).then(() => {
								setFeedback({
									icon: "bi bi-check-circle",
									message: "Login válido",
									color: "text-success",
								});
								setLoading(false);
								route.push("/home")
							})
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
			})
			.catch((err: yup.ValidationError) => {
				setFeedback({
					icon: "bi bi-exclamation-triangle",
					message: err.errors,
					color: "text-danger",
				});
				setLoading(false);
			});
	}, [loginRef, passwordRef]);

	useEffect(() => {
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
								<a
									className={
										"text-decoration-none text-warning fw-bolder d-block text-center"
									}
								>
									<span className={styles.cadastro}>
										Clique aqui para cadastrar-se
									</span>
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
