import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { IAgendamento, IPrestador } from "../../../@types/Models";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { useUser } from "../../../contexts/UserContext";
import { ILayoutTelaSchedule } from "../../../pages/schedule";
import Layout from "../../layout/Layout";
import Nav from "../../layout/Nav";
import FormSchedule from "./FormSchedule";
import ListSchedules from "./ListSchedules";

type Telas = "form" | "lista";

export interface ITargetAgendamento {
	agendamento: IAgendamento;
	estado: "editar" | "deletar" | "novo";
}

export interface IAcoes {
	agendado: IPrestador;
	target?: ITargetAgendamento;
	setTarget?(arg: ITargetAgendamento | ((arg: ITargetAgendamento) => ITargetAgendamento) ): void;
	setTelas?(arg: Telas): void;
	page: number,
	setPage(arg: number): void;
	setAgendado(arg: IPrestador): void;
}

const LayoutSchedule: React.FC<ILayoutTelaSchedule> = ({ setShowTela, agendado, setAgendado }) => {
	const { links, typeUser } = useUser();
	const [telas, setTelas] = useState<Telas>("lista");
	const { dia, mes, ano } = useSchedule();
	const [target, setTarget] = useState<ITargetAgendamento>();
	const [page, setPage] = useState<number>(0);
	
	return (
		<Layout>
			<Nav links={links} />
			<Container>
				<Row className="h-100">
					<div className="col-lg-2 d-none"></div>
					<div className="w-100 col-lg-8 col-12 d-flex flex-column justify-content-center position-relative">
						<div className="d-flex justify-content-around mb-4 mt-5">
							{typeUser == "cliente" && (
								<Button
									variant="primary"
									onClick={() => setShowTela("search")}
								>
									Buscar{" "}
									<i className="bi bi-search"></i>
								</Button>
							)}
							<h1 className="text-white text-center m-2 d-sm-block d-none">
								Data: {`${dia}/${mes}/${ano}`}
							</h1>
							<h1 className="text-white text-center m-2 d-sm-none d-block">
								{`${dia}/${mes}/${ano}`}
							</h1>
							<Button
								variant="success"
								onClick={() => setShowTela("calendario")}
							>
								Calendário <i className="bi bi-calendar3"></i>
							</Button>
						</div>
						<div className="flex-grow-1">
							{telas === "lista" && (
								<ListSchedules
									setTelas={setTelas}
									target={target}
									setTarget={setTarget}
									agendado={agendado}
									setAgendado={setAgendado}
									page={page}
									setPage={setPage}
								/>
							)}
							{telas === "form" && (
								<FormSchedule
									target={target}
									setTarget={setTarget}
									setTelas={setTelas}
									agendado={agendado}
									setAgendado={setAgendado}
									page={page}
									setPage={setPage}
								/>
							)}
						</div>
					</div>
					<div className="col-lg-2 d-none"></div>
				</Row>
			</Container>
		</Layout>
	);
};

export default LayoutSchedule;
