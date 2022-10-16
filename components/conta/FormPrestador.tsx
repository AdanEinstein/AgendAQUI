import React, { useEffect } from "react";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import * as yup from "yup";
import { useUser } from "../../contexts/UserContext";
import { IPrestador } from "../../@types/Models";
import axios, { AxiosError } from "axios";
import { profileEnv } from "../../auth/baseUrl";

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-light",
};

yup.setLocale({
	mixed: {
		required(params) {
			return `${params.path} não foi preenchido`;
		},
	},
	string: {
		matches(params) {
			return `${params.path} incorreto!`;
		},
	},
});

const schemaLogin = yup.object().shape({
	confirmPassword: yup.string().required().label("Confirmação de senha"),
	password: yup.string().required().label("Senha"),
	oldpassword: yup.string().required().label("Senha antiga"),
	login: yup.string().required().label("Login"),
	id: yup.number().required().label("ID"),
});

const schemaPrestador = yup.object().shape({
	paginaFacebook: yup.string().label("Pagina do facebook"),
	email: yup.string().email().required().label("E-mail"),
	descricao: yup.string().label("Descrição"),
	telefone: yup
		.string()
		.required()
		.matches(/(^[0-9]{2})?(s|-)?(9?[0-9]{4})-?([0-9]{4}$)/)
		.label("Telefone"),
	cpfj: yup
		.string()
		.required()
		.matches(
			/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/
		)
		.label("CPF ou CNPJ"),
	nome: yup.string().required().label("Nome"),
	id: yup.number().required().label("ID"),
});

const testSenhas = function (pwd: string, confPwd: string): void {
	if (pwd != confPwd)
		throw new yup.ValidationError("Senhas não correspondem");
};

const FormCliente: React.FC = () => {
	const { user, setAtualizar } = useUser();
	const [loading, setLoading] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
	const [refresh, setRefresh] = useState<boolean>(false);
	const [alterarLogin, setAlterarLogin] = useState<boolean>(false);

	const [nome, setNome] = useState<string>((user as IPrestador).nome);
	const [cpfj, setCpfj] = useState<string>((user as IPrestador).cpfj);
	const [telefone, setTelefone] = useState<string>(
		(user as IPrestador).telefone
	);
	const [descricao, setDescricao] = useState<string>(
		(user as IPrestador).descricao
	);
	const [email, setEmail] = useState<string>((user as IPrestador).email);
	const [paginaFacebook, setPaginaFacebook] = useState<string>(
		(user as IPrestador).paginaFacebook
	);
	const [login, setLogin] = useState<string>(
		(user as IPrestador).login.login
	);
	const [oldpassword, setOldPassword] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const cpfjRef = useRef<HTMLInputElement>(null);
	const telefoneRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let val = cpfjRef.current.value.replace(/\D/g, "");
		if (val.length <= 11) {
			val = val.replace(/^(\d{3})(\d)/, "$1.$2");
			val = val.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
			val = val.replace(/\.(\d{3})(\d)/, ".$1-$2");
		} else {
			val = val.replace(/^(\d{2})(\d)/, "$1.$2");
			val = val.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
			val = val.replace(/\.(\d{3})(\d)/, ".$1/$2");
			val = val.replace(/(\d{4})(\d)/, "$1-$2");
		}
		if (val.length <= 18) setCpfj(val);
		val = telefoneRef.current.value.replace(/\D/g, "");
		if (val.length <= 11) {
			val = val
				.replace(/\D/g, "")
				.replace(/(\d{2})(\d)/, "($1)$2")
				.replace(/(\d{4})(\d)/, "$1-$2")
				.replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
				.replace(/(-\d{4})\d+?$/, "$1");
			setTelefone(val);
		}
	}, []);

	const handleFormatCpfj = useCallback(
		(e: ChangeEvent) => {
			let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
			if (val.length <= 11) {
				val = val.replace(/^(\d{3})(\d)/, "$1.$2");
				val = val.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
				val = val.replace(/\.(\d{3})(\d)/, ".$1-$2");
			} else {
				val = val.replace(/^(\d{2})(\d)/, "$1.$2");
				val = val.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
				val = val.replace(/\.(\d{3})(\d)/, ".$1/$2");
				val = val.replace(/(\d{4})(\d)/, "$1-$2");
			}
			if (val.length <= 18) setCpfj(val);
		},
		[cpfj]
	);

	const handleFormatTelefone = useCallback(
		(e: ChangeEvent) => {
			let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
			if (val.length <= 11) {
				val = val
					.replace(/\D/g, "")
					.replace(/(\d{2})(\d)/, "($1)$2")
					.replace(/(\d{4})(\d)/, "$1-$2")
					.replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
					.replace(/(-\d{4})\d+?$/, "$1");
				setTelefone(val);
			}
		},
		[telefone]
	);

	const handleAtualizar = async () => {
		const newUser = {
			id: (user as IPrestador).id,
			nome,
			cpfj,
			telefone,
			descricao,
			email,
			paginaFacebook,
		};
		const newLogin = {
			id: (user as IPrestador).login.id,
			login,
			oldpassword,
			password,
			confirmPassword,
		};
		setLoading(true);
		try {
			let data = {};
			if (alterarLogin) {
				await schemaLogin.validate(newLogin);
				testSenhas(newLogin.password, newLogin.confirmPassword);
				data = {
					login: {
						id: newLogin.id,
						login: newLogin.login,
						oldpassword: newLogin.oldpassword,
						password: newLogin.password,
					},
					prestador: newUser,
				};
			} else {
				data = { prestador: newUser };
			}

			await schemaPrestador.validate(newUser);
			const posted = await axios.post(
				`${profileEnv.baseUrl}/alterarprestador`,
				data,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			setFeedback({
				icon: "bi bi-check-circle",
				message: "Dados alterados!",
				color: "text-success",
			});
			setLoading(false);
			localStorage.setItem(
				"user",
				JSON.stringify({
					...posted.data,
				})
			);
			setAtualizar(true);
			setAlterarLogin(false);
			setRefresh(false);
			setLoading(false);
		} catch (err) {
			if ("response" in err) {
				setFeedback({
					icon: "bi bi-exclamation-diamond-fill",
					message: err.response.data,
					color: "text-warning",
				});
				setLoading(false);
			} else {
				setFeedback({
					icon: "bi bi-exclamation-diamond-fill",
					message: err.errors,
					color: "text-danger",
				});
				setLoading(false);
			}
		}
	};

	return (
		<div className={"container d-flex justify-content-center"}>
			<div className="col-lg-6 col-md-8 col-12">
				<h2 className="d-md-block d-none mb-4">
					Aqui estão seus dados:
				</h2>
				<h2 className="d-md-none d-block">Dados:</h2>
				<Form className="text-black">
					<FloatingLabel label="Nome" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Nome"
							disabled={loading || !refresh}
							value={nome}
							onChange={(e) => setNome(e.target.value)}
						/>
					</FloatingLabel>
					<FloatingLabel label="CPF ou CNPJ" className="mb-3">
						<Form.Control
							type="text"
							placeholder="CPF ou CNPJ"
							disabled={loading || !refresh}
							ref={cpfjRef}
							value={cpfj}
							onChange={handleFormatCpfj}
						/>
					</FloatingLabel>
					<FloatingLabel label="Telefone" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Telefone"
							disabled={loading || !refresh}
							ref={telefoneRef}
							value={telefone}
							onChange={handleFormatTelefone}
						/>
					</FloatingLabel>
					<FloatingLabel label="E-mail" className="mb-3">
						<Form.Control
							type="email"
							placeholder="E-mail"
							disabled={loading || !refresh}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FloatingLabel>
					<FloatingLabel label="Página facebook" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Página facebook"
							disabled={loading || !refresh}
							value={paginaFacebook}
							onChange={(e) => setPaginaFacebook(e.target.value)}
						/>
					</FloatingLabel>
					<div className="container d-flex flex-row justify-content-between mb-3">
						<h4 className="text-white">Login:</h4>
						{!refresh ? null : !alterarLogin ? (
							<Button
								variant="warning"
								onClick={() => setAlterarLogin(true)}
							>
								Quero mudar login{" "}
								<i className="bi bi-check-circle-fill"></i>
							</Button>
						) : (
							<Button
								variant="secondary"
								onClick={() => setAlterarLogin(false)}
							>
								Não quero mais <i className="bi bi-x-lg"></i>
							</Button>
						)}
					</div>
					<FloatingLabel label="Login" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Login"
							disabled={loading || !alterarLogin}
							value={login}
							onChange={(e) => setLogin(e.target.value)}
						/>
					</FloatingLabel>
					{alterarLogin && (
						<>
							<FloatingLabel
								label="Senha antiga"
								className="mb-3"
							>
								<Form.Control
									type="password"
									placeholder="Senha antiga"
									disabled={loading || !refresh}
									value={oldpassword}
									onChange={(e) =>
										setOldPassword(e.target.value)
									}
								/>
							</FloatingLabel>
							<FloatingLabel label="Senha" className="mb-3">
								<Form.Control
									type="password"
									placeholder="Senha"
									disabled={loading || !refresh}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</FloatingLabel>
							<FloatingLabel
								label="Confirmação da senha"
								className="mb-3"
							>
								<Form.Control
									type="password"
									placeholder="Confimação da senha"
									disabled={loading || !refresh}
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								/>
							</FloatingLabel>
						</>
					)}
					<FeedbackText feedback={feedback} />
					{loading ? (
						<Button
							className="w-100 mb-3"
							variant="warning"
							disabled
						>
							Loading...
						</Button>
					) : refresh ? (
						<div className="d-flex flex-row">
							<Button
								className="w-100 me-2 mb-3"
								variant="danger"
								onClick={() => {
									setRefresh(false);
									setAlterarLogin(false);
								}}
							>
								Cancelar <i className="bi bi-x-lg"></i>
							</Button>
							<Button
								className="w-100 ms-2 mb-3"
								variant="warning"
								onClick={handleAtualizar}
							>
								Atualizar{" "}
								<i className="bi bi-check-circle-fill"></i>
							</Button>
						</div>
					) : (
						<Button
							className="w-100 mb-3"
							variant="warning"
							onClick={() => setRefresh(true)}
						>
							Quero atualizar <i className="bi bi-pen-fill"></i>
						</Button>
					)}
				</Form>
			</div>
		</div>
	);
};

export default FormCliente;
