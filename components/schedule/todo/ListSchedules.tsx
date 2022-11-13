import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { ISchedule } from "./ISchedule";
import styles from "./ListSchedule.module.css";
import { IAcoes } from "./LayoutSchedule";
import shortid from "shortid";
import StatusTable from "./StatusTable";
import ProdutosTable from "./ProdutosTable";
import { useUser } from "../../../contexts/UserContext";
import { profileEnv } from "../../../auth/baseUrl";
import axios from "axios";
import { IAgendamento, ICliente, IPrestador } from "../../../@types/Models";

const ListSchedules: React.FC<IAcoes> = ({
	setTelas,
	setTarget,
	agendado,
	page,
	setPage,
}) => {
	const { typeUser, user } = useUser();
	const { dia, mes, ano, schedules, setSchedules } = useSchedule();
	const [restore, setRestore] = useState<boolean>(false);

	useEffect(() => {
		const getAgendamentos = async () => {
			let data = { data: {} };
			if (agendado) {
				data = await axios.post(
					`${profileEnv.baseUrl}/getagendamentosprestador`,
					{
						id: agendado.id,
						data: `${dia}/${mes}/${ano}`,
						page: page,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
							"Content-Type": "application/json",
						},
					}
				);
			} else {
				data = await axios.post(
					`${profileEnv.baseUrl}/getagendamentos${typeUser !== "login" && typeUser}`,
					{ id: user.id, data: `${dia}/${mes}/${ano}`, page: page },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
							"Content-Type": "application/json",
						},
					}
				);
			}
			return data.data;
		};
		getAgendamentos()
			.then((data) => {
				if (typeof data == "string") {
					setSchedules([]);
				} else {
					const agendamentosParaSchedules: ISchedule[] = (
						data as IAgendamento[]
					).map((agen) => {
						const sch: ISchedule = {
							id: agen.id,
							cliente: agen.cliente,
							prestador: agen.prestador,
							data: agen.dataEHora.split(" ")[0],
							horario: agen.dataEHora.split(" ")[1],
							status:
								agen.status === 0
									? "agendado"
									: agen.status === 1
									? "concluido"
									: "cancelado",
							produtos: JSON.parse(
								(agen as any).produtosAgendados
							),
						};
						return sch;
					});
					setSchedules(agendamentosParaSchedules);
				}
			})
			.catch(() => {
				setSchedules([]);
			});
	}, [dia, mes, ano, restore, user, page]);

	const orderByHour = (schedA: ISchedule, schedB: ISchedule) => {
		const [horaA, minutoA] = schedA.horario.split(":");
		const [horaB, minutoB] = schedB.horario.split(":");
		const horaNumA = parseInt(horaA);
		const minutoNumA = parseInt(minutoA);
		const horaNumB = parseInt(horaB);
		const minutoNumB = parseInt(minutoB);
		if (horaNumA > horaNumB) return -1;
		else if (horaNumA < horaNumB) return 1;
		else {
			if (minutoNumA > minutoNumB) return -1;
			else if (minutoNumA < minutoNumB) return 1;
			else return 0;
		}
	};

	const handleListDelete = useCallback(
		(agend: IAgendamento) => {
			if (setTarget && setTelas) {
				setTarget({ agendamento: agend, estado: "deletar" });
				setTelas("form");
			}
		},
		[setTarget, setTelas]
	);

	const handleListEdit = useCallback(
		(agend: IAgendamento) => {
			if (setTarget && setTelas) {
				setTarget({ agendamento: agend, estado: "editar" });
				setTelas("form");
			}
		},
		[setTarget, setTelas]
	);

	return (
		<Container className={styles.Lista}>
			<Table className="table-light">
				<thead className="table-dark">
					<tr>
						<th>Horário</th>
						<th>{(typeUser == "prestador" || agendado) ? "Cliente" : "Prestador"}</th>
						<th className="d-md-table-cell d-none">Produtos</th>
						<th className="d-md-table-cell d-none">Status</th>
						{!agendado && (<th>Ações</th>)}
					</tr>
				</thead>
				<tbody>
					{schedules?.sort(orderByHour).map((sch) => {
						return (
							<tr key={sch.id}>
								<td>{sch.horario}</td>
								<td>
									{(typeUser == "prestador" || agendado) ? (sch.cliente as  ICliente).nome : (sch.prestador as IPrestador).nome}
								</td>
								<ProdutosTable schedule={sch} />
								<StatusTable
									schedule={sch}
									setRestore={setRestore}
									restore={restore}
								/>
								{!agendado && (<td className="d-flex justify-content-around">
									<Button
										size="sm"
										variant="warning"
										disabled={sch.status === "concluido"}
										onClick={() =>
											handleListEdit({
												id: sch.id as number,
												dataEHora: `${sch.data} ${sch.horario}`,
												cliente: (sch.cliente as ICliente),
												prestador: (sch.prestador as IPrestador),
												produtos: sch.produtos,
												status:
													sch.status === "agendado"
														? 0
														: sch.status ===
														  "cancelado"
														? -1
														: 1,
											})
										}
									>
										<i className="bi bi-pencil-square flex-grow-1 mx-1"></i>
									</Button>
									<Button
										size="sm"
										variant="danger"
										disabled={sch.status === "concluido"}
										onClick={() => handleListDelete({
											id: sch.id as number,
											dataEHora: `${sch.data} ${sch.horario}`,
											cliente: (sch.cliente as ICliente),
											prestador: (sch.prestador as IPrestador),
											produtos: sch.produtos,
											status:
												sch.status === "agendado"
													? 0
													: sch.status ===
													  "cancelado"
													? -1
													: 1,
										})}
									>
										<i className="bi bi-trash-fill flex-grow-1 mx-1"></i>
									</Button>
								</td>)}
							</tr>
						);
					})}
				</tbody>
			</Table>
			<div className="m-2 d-flex flex-row justify-content-end">
					<div>
						<Button
							className="mx-1"
							variant="secondary"
							disabled={page == 0}
							onClick={() => {
								setPage(page - 1);
							}}
						>
							Anterior <i className="bi bi-chevron-left"></i>
						</Button>
					</div>
					<div>
						<Button
							className="mx-1"
							variant="secondary"
							disabled={schedules?.length !== 10}
							onClick={() => {
								if (schedules?.length !== 0) {
									setPage(page + 1);
								}
							}}
						>
							Próximo <i className="bi bi-chevron-right"></i>
						</Button>
					</div>
			</div>
			{typeUser == "cliente" && agendado && (
				<Button
					className="position-absolute btn-lg"
					style={{ bottom: 30, right: 30 }}
					onClick={() => {
						setTarget &&
							setTarget({
								agendamento: {
									id: shortid(),
									cliente: user as ICliente,
									prestador: agendado,
									dataEHora: `${dia}/${mes}/${ano}`,
									status: 0,
									produtos: [],
								},
								estado: "novo",
							});
						setTelas && setTelas("form");
					}}
				>
					Novo agendamento <i className="bi bi-plus-square-fill"></i>
				</Button>
			)}
		</Container>
	);
};

export default ListSchedules;
