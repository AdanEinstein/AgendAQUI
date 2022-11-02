import React, { useCallback, useRef, useState } from "react";
import { Overlay, Popover, PopoverBody, PopoverHeader } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { generate } from "shortid";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { ISchedule, Status } from "./ISchedule";

interface IStatusTableProps {
	schedule: ISchedule;
	restore: boolean;
	setRestore(arg: boolean): void;
}

const StatusTable: React.FC<IStatusTableProps> = ({
	schedule,
	setRestore,
	restore,
}) => {
	const tdRef = useRef<HTMLTableDataCellElement>(null);
	const [show, setShow] = useState<boolean>(false);
	const [fix, setFix] = useState<boolean>(false);
	const { dia, mes, ano } = useSchedule();

	const handleEditStatus = useCallback(
		(status: Status, sched: ISchedule) => {
			// const newSchedule: ISchedule = {
			// 	...sched,
			// 	status: status,
			// };
			// window.Main.sendMessage("editschedule", {
			// 	schedule: newSchedule,
			// 	ano,
			// 	mes,
			// 	dia,
			// });
			// window.Main.on("editschedule", () => {
			// 	setFix(false);
			// 	setRestore(!restore);
			// });
			// const total = newSchedule.produto
			// 	.map((sch) => sch.valor)
			// 	.reduce((acc: number, atual: string) => {
			// 		const curr = parseFloat(
			// 			atual.replace(".", "").replace(",", ".")
			// 		);
			// 		return (acc += curr);
			// 	}, 0)
			// 	.toLocaleString("pt-br", { minimumFractionDigits: 2 });
			// if (status === "concluido") {
			// 	window.Main.sendMessage("newfinance", {
			// 		finance: {
			// 			id: schedule.id,
			// 			descricao: `Pagamento ${schedule.cliente}`,
			// 			valor: total,
			// 			tipo: "entrada",
			// 			data: `${dia}/${mes}/${ano}`,
			// 		},
			// 		ano,
			// 		mes,
			// 	});
			// } else {
			// 	window.Main.sendMessage("deletefinance", {
			// 		finance: {
			// 			id: schedule.id,
			// 			descricao: `Pagamento ${schedule.cliente}`,
			// 			valor: total,
			// 			tipo: "entrada",
			// 			data: `${dia}/${mes}/${ano}`,
			// 		},
			// 		ano,
			// 		mes,
			// 	});
			// }
		},
		[restore]
	);

	return (
		<>
			<td
				className={`d-md-table-cell d-none ${
					(schedule.status === "agendado" && "table-secondary") ||
					(schedule.status === "concluido" && "table-success") ||
					(schedule.status === "cancelado" && "table-danger")
				}`}
				ref={tdRef}
				onClick={() => {
					setFix(!fix);
					setShow(false);
				}}
				onMouseEnter={() => {
					if (!fix) {
						setShow(true);
					}
				}}
				onMouseLeave={() => {
					if (!fix) {
						setShow(false);
					}
				}}
			>
				{(schedule.status === "agendado" && (
					<span>
						Agendado <i className="bi bi-hourglass-split"></i>
					</span>
				)) ||
					(schedule.status === "concluido" && (
						<span>
							Concluído <i className="bi bi-check2-circle"></i>
						</span>
					)) ||
					(schedule.status === "cancelado" && (
						<span>
							Cancelado <i className="bi bi-x-circle"></i>
						</span>
					))}
			</td>
			<Overlay
				target={tdRef.current}
				show={show}
				placement={"left-start"}
			>
				{(props) => {
					return (
						<Popover {...props}>
							<PopoverHeader as="h3">Status</PopoverHeader>
							<PopoverBody>
								Clique para mudar o status!
							</PopoverBody>
						</Popover>
					);
				}}
			</Overlay>
			<Overlay target={tdRef.current} show={fix} placement={"left-start"}>
				{(props) => {
					return (
						<Popover {...props}>
							<PopoverHeader as="h3">Status</PopoverHeader>
							<PopoverBody>
								<div
									className="d-flex flex-column"
									onMouseLeave={() => setFix(false)}
								>
									<Button
										className="flex-grow-1 m-3"
										variant={"secondary"}
										size="lg"
										disabled={
											schedule.status === "agendado"
										}
										onClick={() =>
											handleEditStatus(
												"agendado",
												schedule
											)
										}
									>
										Agendado{" "}
										<i className="bi bi-hourglass-split"></i>
									</Button>
									<Button
										className="flex-grow-1 m-3"
										variant={"danger"}
										size="lg"
										disabled={
											schedule.status === "cancelado"
										}
										onClick={() =>
											handleEditStatus(
												"cancelado",
												schedule
											)
										}
									>
										Cancelado{" "}
										<i className="bi bi-x-circle"></i>
									</Button>
									<Button
										className="flex-grow-1 m-3"
										variant={"success"}
										size="lg"
										disabled={
											schedule.status === "concluido"
										}
										onClick={() =>
											handleEditStatus(
												"concluido",
												schedule
											)
										}
									>
										Concluído{" "}
										<i className="bi bi-check2-circle"></i>
									</Button>
								</div>
							</PopoverBody>
						</Popover>
					);
				}}
			</Overlay>
		</>
	);
};

export default StatusTable;
