import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import styles from "./FormCadastroCliente.module.css";
import * as yup from "yup";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import { profileEnv } from "../../auth/baseUrl";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

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

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-primary",
};

const schema = yup.object().shape({
	dataNascimento: yup
		.string()
		.required()
		.matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
		.label("Data de nascimento"),
	telefone: yup
		.string()
		.required()
		.matches(/(^[0-9]{2})?(s|-)?(9?[0-9]{4})-?([0-9]{4}$)/)
		.label("Telefone"),
	cpf: yup
		.string()
		.required()
		.matches(
			/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/
		)
		.label("CPF"),
	nome: yup.string().required().label("Nome"),
});

const FormCadastroCliente: React.FC = () => {
	const route = useRouter()
	const [loading, setLoading] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);

	const [cpf, setCpf] = useState<string>("");
	const [telefone, setTelefone] = useState<string>("");

	const nomeRef = useRef<HTMLInputElement>(null);
	const cpfRef = useRef<HTMLInputElement>(null);
	const telefoneRef = useRef<HTMLInputElement>(null);
	const dataRef = useRef<HTMLInputElement>(null);

	const handleFinalizar = useCallback(() => {
		setLoading(true);
		const cliente = {
			nome: nomeRef.current.value,
			cpf: cpfRef.current.value,
			telefone: telefoneRef.current.value,
			dataNascimento: dataRef.current.value,
		};

		schema
			.validate(cliente)
			.then(() => {
				setFeedback({
					icon: "bi bi-check-circle",
					message: "Login válido",
					color: "text-success",
				});
				axios
					.post(`${profileEnv.baseUrl}/cadastracliente`, {
						nome: nomeRef.current.value,
						cpf: cpfRef.current.value,
						telefone: telefoneRef.current.value,
						dataNascimento: dataRef.current.value,
						loginid: typeof JSON.parse(localStorage.getItem('user'))?.login == 'object' ? null : JSON.parse(localStorage.getItem('user'))?.id 
					}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
					.then((newCliente) => {
						if (newCliente.status === 201) {
							route.push('/')
						} else {
							setFeedback({
								icon: "bi bi-exclamation-diamond-fill",
								message: newCliente.data,
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
				setLoading(false);
			})
			.catch((err: yup.ValidationError) => {
				setFeedback({
					icon: "bi bi-exclamation-diamond-fill",
					message: err.errors,
					color: "text-danger",
				});
				setLoading(false);
			});
	}, []);

	const handleFormatCpf = useCallback(
		(e: ChangeEvent) => {
			let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
			if (val.length <= 11) {
				val = val.replace(/^(\d{3})(\d)/, "$1.$2");
				val = val.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
				val = val.replace(/\.(\d{3})(\d)/, ".$1-$2");
				setCpf(val);
			}
		},
		[cpf]
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

	return (
		<>
			<div className={styles.FormCadastroCliente + " container"}>
				<div className="col-lg-6 col-md-8 col-12">
					<h2 className="d-md-block d-none">
						Olá cliente, preencha com seus dados para finalizarmos
						seu cadastro
					</h2>
					<h2 className="d-md-none d-block">
						Finalizaremos logo, cliente!
					</h2>

					<Form>
						<FloatingLabel label="Nome" className="mb-3">
							<Form.Control
								type="text"
								placeholder="Nome"
								ref={nomeRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel label="CPF" className="mb-3">
							<Form.Control
								type="text"
								placeholder="CPF"
								ref={cpfRef}
								disabled={loading}
								value={cpf}
								onChange={handleFormatCpf}
							/>
						</FloatingLabel>
						<FloatingLabel label="Telefone" className="mb-3">
							<Form.Control
								type="text"
								placeholder="Telefone"
								ref={telefoneRef}
								disabled={loading}
								value={telefone}
								onChange={handleFormatTelefone}
							/>
						</FloatingLabel>
						<FloatingLabel
							label="Data de Nascimento"
							className="mb-3"
						>
							<Form.Control
								type="date"
								placeholder="Data de nascimento"
								ref={dataRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FeedbackText feedback={feedback} />
						{loading ? (
							<Button
								className="w-100"
								variant="warning"
								disabled
							>
								Loading...
							</Button>
						) : (
							<Button
								className="w-100"
								variant="warning"
								onClick={handleFinalizar}
							>
								Finalizar{" "}
								<i className="bi bi-check-circle-fill"></i>
							</Button>
						)}
					</Form>
				</div>
			</div>
		</>
	);
};

export default FormCadastroCliente;
