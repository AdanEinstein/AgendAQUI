import React, {
	ChangeEvent,
	KeyboardEvent,
	useCallback,
	useState,
} from "react";
import { Container, FloatingLabel, FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import { IDataCalendar } from "../utils/utils";
import * as yup from "yup";

interface IProps {
	data: IDataCalendar;
	setData(arg: IDataCalendar): void;
}

const feedbackDefault = {
	icon: "bi bi-exclamation-circle-fill",
	message: "Digite e pressione o ENTER para selecionar a data!",
	color: "text-primary",
};

yup.setLocale({
	mixed: {
		required(params) {
			return `${params.path} não foi preenchida!`;
		},
	},
	string: {
		matches: "Data inválida!",
	},
});

const schema = yup.object().shape({
	data: yup
		.string()
		.required()
		.matches(
			/(^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(\d{4})$)|(^(0?[1-9]|1[012])\/(\d{4})$)/
		)
		.label("Data"),
});

const MonthNavButton: React.FC<IProps> = ({ data, setData }) => {
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
	const [dataLocal, setDataLocal] = useState<string>(
		`${data.dia}/${
			parseInt(data.mes) < 10 ? `0${data.mes}` : `${data.mes}`
		}/${data.ano}`
	);

	const handleVoltar = useCallback(() => {
		if (data.mes !== "01" && data.mes !== "1") {
			setData({ ...data, mes: `${parseInt(data.mes) - 1}` });
			setDataLocal(
				`${data.dia}/${
					parseInt(data.mes) - 1 < 10
						? `0${parseInt(data.mes) - 1}`
						: `${parseInt(data.mes) - 1}`
				}/${data.ano}`
			);
		} else {
			setData({ ...data, mes: "12", ano: `${parseInt(data.ano) - 1}` });
			setDataLocal(`${data.dia}/12/${parseInt(data.ano) - 1}`);
		}
	}, [data]);

	const handleAvancar = useCallback(() => {
		if (data.mes !== "12") {
			setData({ ...data, mes: `${parseInt(data.mes) + 1}` });
			setDataLocal(
				`${data.dia}/${
					parseInt(data.mes) + 1 < 10
						? `0${parseInt(data.mes) + 1}`
						: `${parseInt(data.mes) + 1}`
				}/${data.ano}`
			);
		} else {
			setData({ ...data, mes: "01", ano: `${parseInt(data.ano) + 1}` });
			setDataLocal(`${data.dia}/01/${parseInt(data.ano) + 1}`);
		}
	}, [data]);

	const handleData = useCallback(
		(e: ChangeEvent) => {
			const date = (e.target as HTMLInputElement).value;
			// /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
			if (date.length < 11) {
				const result = date
					.replace(/\D/g, "")
					.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3")
					.replace(/(\d{2})(\d{4})$/, "$1/$2");
				setDataLocal(result);
			}
		},
		[dataLocal]
	);

	const handleEnter = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			const enter = e.key;
			if (enter === "Enter") {
				schema
					.validate({ data: dataLocal })
					.then(() => {
						const dataArray = dataLocal.split("/");
						if (dataArray.length === 3) {
							const [dia, mes, ano] = dataArray;
							setData({ dia, mes, ano });
						} else {
							const [mes, ano] = dataArray;
							setData({ dia: "01", mes, ano });
						}
						setFeedback({
							icon: "bi bi-check2-circle",
							message: "Data válida!",
							color: "text-success",
						});
					})
					.catch((err: yup.ValidationError) => {
						if (err.type === "required") {
							setFeedback({
								icon: "bi bi-exclamation-triangle-fill",
								message: err.errors,
								color: "text-danger",
							});
						} else {
							setFeedback({
								icon: "bi bi-exclamation-triangle-fill",
								message: "Data inválida!",
								color: "text-danger",
							});
						}
					});
			}
		},
		[dataLocal]
	);

	return (
		<Container className="d-flex justify-content-center">
			<div className="col-md-1 col-lg-1 d-none"></div>
			<div className="col-md-10 col-lg-10 col-12 pb-3">
				<div className="d-flex mb-3">
					<Button variant="danger" onClick={handleVoltar}>
						<i className="bi bi-arrow-left-circle-fill"></i> Voltar
					</Button>
					<FloatingLabel className="flex-grow-1 mx-2" label="Data">
						<FormControl
							className="text-center"
							value={dataLocal}
							onChange={handleData}
							onKeyUp={handleEnter}
						/>
					</FloatingLabel>
					<Button variant="success" onClick={handleAvancar}>
						Avançar{" "}
						<i className="bi bi-arrow-right-circle-fill"></i>
					</Button>
				</div>
				<FeedbackText feedback={feedback} />
			</div>
			<div className="col-md-1 col-lg-1 d-none"></div>
		</Container>
	);
};

export default MonthNavButton;
