import { useCallback, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import styles from "./FormCadastroPrestador.module.css";
import * as yup from "yup";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";

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
		email: "E-mail inválido!"
	},
});

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-primary",
};

const schema = yup.object().shape({
	email: yup.string().email().required().label("E-mail"),
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
});

const FormCadastroPrestador: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);

	const nomeRef = useRef<HTMLInputElement>(null);
	const cpfjRef = useRef<HTMLInputElement>(null);
	const telefoneRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const handleFinalizar = useCallback(() => {
		setLoading(true);
		const prestador = {
			nome: nomeRef.current.value,
			cpfj: cpfjRef.current.value,
			telefone: telefoneRef.current.value,
			email: emailRef.current.value,
		};

		schema
			.validate(prestador)
			.then(() => {
				setFeedback({
					icon: "bi bi-check-circle",
					message: "Login válido",
					color: "text-success",
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

	return (
		<>
			<div className={styles.FormCadastroPrestador + " container"}>
				<div className="col-lg-6 col-md-8 col-12">
					<h2 className="d-md-block d-none">
						Olá prestador, preencha com seus dados para finalizarmos
						seu cadastro
					</h2>
					<h2 className="d-md-none d-block">Finalizaremos logo, prestador!</h2>

					<Form>
						<FloatingLabel label="Nome" className="mb-3">
							<Form.Control
								type="text"
								placeholder="Nome"
								ref={nomeRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel label="CPF ou CNPJ" className="mb-3">
							<Form.Control
								type="text"
								placeholder="CPF ou CNPJ"
								ref={cpfjRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel label="Telefone" className="mb-3">
							<Form.Control
								type="text"
								placeholder="Telefone"
								ref={telefoneRef}
								disabled={loading}
							/>
						</FloatingLabel>
						<FloatingLabel
							label="E-mail"
							className="mb-3"
						>
							<Form.Control
								type="email"
								placeholder="E-mail"
								ref={emailRef}
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

export default FormCadastroPrestador;
