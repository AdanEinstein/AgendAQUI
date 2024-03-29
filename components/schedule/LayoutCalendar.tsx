import React, { useEffect, useState } from "react";
import {Button, Container, Row} from "react-bootstrap";
import { useSchedule } from "../../contexts/ScheduleContext";
import { ILayoutTelaSchedule } from "../../pages/schedule";
import Layout from "../layout/Layout";
import { IDataCalendar, nameMonth } from "../utils/utils";
import Calendar from "./Calendar";
import MonthNavButton from "./MonthNavButton";
import { useUser } from "../../contexts/UserContext";
import Nav from "../layout/Nav";

const dataAtual = new Date();

const LayoutCalendar: React.FC<ILayoutTelaSchedule> = (props) => {
	const { links, typeUser } = useUser();
	const { dia, mes, ano } = useSchedule();
	const [data, setData] = useState<IDataCalendar>({
		dia: `${dataAtual.getDate()}`,
		mes: `${dataAtual.getMonth() + 1}`,
		ano: `${dataAtual.getFullYear()}`,
	});

	return (
		<Layout>
			<Nav links={links} />
			<Container className="d-flex flex-column">
				<Row>
					<div className="d-flex justify-content-around mb-4 mt-4">
						{props.agendado ? (
							<>
								<h1 className="text-white d-sm-block d-none">
									Agenda: {props.agendado.nome}
								</h1>
								<h1 className="text-white d-block d-sm-none">
									Agenda: {props.agendado.nome.length <= 20 ? props.agendado.nome : props.agendado.nome.split('', 20).join('')+"..."}
								</h1>
							</>
						) : (
							<h1 className="text-white">
								Agenda:{" "}
								{`${nameMonth(parseInt(data.mes))} de ${
									data.ano
								}`}
							</h1>
						)}
						<Button
							variant="success"
							onClick={() => props.setShowTela("todo")}
						>
							Agendamentos <i className="bi bi-list-check"></i>
						</Button>
					</div>
				</Row>
				<Row>
					<MonthNavButton data={data} setData={setData}/>
				</Row>
				<Row className="flex-grow-1">
					<Calendar data={data} {...props} />
				</Row>
			</Container>
		</Layout>
	);
};

export default LayoutCalendar;
