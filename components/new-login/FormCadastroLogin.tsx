import { useCallback, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import styles from "./FormCadastroLogin.module.css";
import Link from "next/link";
import { FormCheck } from "react-bootstrap";
import MyModal from "../layout/Modal";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { profileEnv } from "../../auth/baseUrl";
import * as yup from "yup";

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-primary",
};

//Validation form
yup.setLocale({
	mixed: {
		required(params) {
			return `${params.path} não foi preenchido!`
		},
	}
})

const schema = yup.object().shape({
	confirmPassword: yup.string().required().label("Confirmação de senha"),
	password: yup.string().required().label("Senha"),
	login: yup.string().required().label("Login"),
});

const testSenhas = function (pwd: string, confPwd: string): void {
	if (pwd != confPwd) throw new yup.ValidationError("Senhas inválidas");
};

const FormCadastroLogin: React.FC = () => {
	const route = useRouter();
	// Estados pertinentes ao componente
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
	const [tipo, setTipo] = useState<"cliente" | "prestador">("cliente");
	//Referencias
	const tipoRef = useRef<"cliente" | "prestador">(tipo);
	const loginRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	// Funções chamadas
	const handleTipoUsuario = useCallback(() => {
		if (tipo === "cliente") {
			setTipo("prestador");
			tipoRef.current = "prestador";
		} else {
			setTipo("cliente");
			tipoRef.current = "cliente";
		}
	}, [tipo, tipoRef]);

	const handleContinuar = useCallback(() => {
		setLoading(true);
		const user = {
			login: loginRef.current.value,
			password: passwordRef.current.value,
			confirmPassword: confirmPasswordRef.current.value,
		};

		schema.validate(user)
			.then(user => {
				testSenhas(user.password, user.confirmPassword)
				setFeedback(feedbackDefault)
				setShowModal(true)
			}).catch((err: yup.ValidationError) => {
				setFeedback({
					icon: "bi bi-x-octagon-fill",
					message: err.errors,
					color: "text-danger",
				});
				setLoading(false);
			})
	}, [loginRef, passwordRef, confirmPasswordRef]);

	const handleConfirm = useCallback(() => {
		setShowModal(false);
		setLoading(true);
		axios
			.post(`${profileEnv.baseUrl}/cadastralogin`, {
				login: loginRef.current.value,
				password: passwordRef.current.value,
			})
			.then((newLogin) => {
				if (newLogin.status === 201) {
					route.push(`/cadastro/${tipoRef.current}`);
				} else {
					setFeedback({
						icon: "bi bi-exclamation-diamond-fill",
						message: newLogin.data,
						color: "text-warning",
					});
					setLoading(false);
				}
			})
			.catch((err: AxiosError) => {
				setFeedback({
					icon: "bi bi-exclamation-diamond-fill",
					message: err.response.data,
					color: "text-warning",
				});
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		loginRef.current.focus();
	}, [loginRef]);

	return (
		<>
			<div className={styles.FormCadastroLogin + " container"}>
				<div className="col-lg-6 col-md-8 col-12">
					<h2 className="d-md-block d-none">
						Bem vindo! Faça o seu cadastro aqui!
					</h2>
					<h2 className="d-md-none d-block">
						Faça o seu cadastro aqui!
					</h2>
					<Form>
						<FloatingLabel label="Login" className="mb-3">
							<Form.Control
								type="text"
								placeholder="Login"
								ref={loginRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel label="Senha" className="mb-3">
							<Form.Control
								type="password"
								placeholder="Senha"
								ref={passwordRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel
							label="Confirme sua senha"
							className="mb-3"
						>
							<Form.Control
								type="password"
								placeholder="Senha"
								ref={confirmPasswordRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FeedbackText feedback={feedback} />
						{/* Seleção do tipo de usuários */}
						<div className="container d-flex flex-row text-light mb-3">
							<FormCheck
								className="mx-1"
								type="switch"
								label="Eu sou"
								onChange={handleTipoUsuario}
								disabled={loading}
							/>
							<span
								className={`mx-2 + ${
									tipo === "cliente" &&
									" fw-bolder text-warning"
								}`}
							>
								Cliente
								{tipo === "cliente" && (
									<i className="bi bi-check-lg"></i>
								)}
							</span>
							|
							<span
								className={`mx-2 ${
									tipo === "prestador" &&
									" fw-bolder text-warning"
								}`}
							>
								Prestador
								{tipo === "prestador" && (
									<i className="bi bi-check-lg"></i>
								)}
							</span>
						</div>
						{loading ? (
							<Button
								className="w-100"
								variant="warning"
								disabled
							>
								Loading...
							</Button>
						) : (
							<div className="container d-flex justify-content-between">
								<Link href="/">
									<a
										className="btn btn-outline-danger col-5"
										// style={{
										// 	width: "47%",
										// 	marginRight: "calc(100% - 94%)",
										// }}
									>
										<i className="bi bi-arrow-left"></i>{" "}
										Voltar
									</a>
								</Link>
								<Button
									className="col-5"
									variant="warning"
									// style={{ width: "47%" }}
									onClick={handleContinuar}
								>
									Continuar{" "}
									<i className="bi bi-arrow-right"></i>
								</Button>
							</div>
						)}
					</Form>
				</div>
			</div>
			{/* Modal */}
			<MyModal
				title="Confirmação de Login"
				labelbutton="Correto"
				show={showModal}
				onHide={() => {
					setShowModal(false);
					setLoading(false);
				}}
				onConfirm={handleConfirm}
			>
				<h4>Tipo de usuário</h4>
				<p>
					Deseja prosseguir com o seu cadastro de
					<span className="text-uppercase text-danger fw-bolder">
						{tipo === "cliente"
							? " cliente"
							: " prestador de serviço"}
					</span>
					, correto?
				</p>
			</MyModal>
		</>
	);
};

export default FormCadastroLogin;
