import React, { useCallback, useRef, useState } from "react";
import {
	Overlay,
	Popover,
	PopoverBody,
	PopoverHeader,
	Table,
} from "react-bootstrap";
import { ISchedule } from "./ISchedule";

interface IProdutosTableProps {
	schedule: ISchedule;
}

const ProdutosTable: React.FC<IProdutosTableProps> = ({ schedule }) => {
	const tdRef = useRef<HTMLTableDataCellElement>(null);
	const [show, setShow] = useState<boolean>(false);

	return (
		<>
			<td
				className="d-md-table-cell d-none table-primary"
				ref={tdRef}
				onMouseEnter={() => {
					setShow(true);
				}}
				onMouseLeave={() => {
					setShow(false);
				}}
			>
				{schedule.produto
					.map((sch) => sch.valor)
					.reduce((acc: number, atual: string) => {
						const curr = parseFloat(
							atual.replace(".", "").replace(",", ".")
						);
						return (acc += curr);
					}, 0)
					.toLocaleString("pt-br", {
						style: "currency",
						currency: "BRL",
					})}
			</td>
			<Overlay
				target={tdRef.current}
				show={show}
				placement={"left-start"}
			>
				{(props) => {
					return (
						<Popover {...props}>
							<PopoverHeader as="h3">Produtos</PopoverHeader>
							<PopoverBody>
								<Table>
									<thead>
										<tr>
											<th>Descrição</th>
											<th>Valor R$</th>
										</tr>
									</thead>
									<tbody>
										{schedule.produto?.map((sch) => {
											return (
												<tr key={sch.id}>
													<td>{sch.descricao}</td>
													<td>{sch.valor}</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
								<div className='d-flex align-items-center'>
									<span className='flex-grow-1'>Total:</span>
									<span className='flex-grow-1 btn btn-success'>
										{schedule.produto
											.map((sch) => sch.valor)
											.reduce(
												(
													acc: number,
													atual: string
												) => {
													const curr = parseFloat(
														atual
															.replace(".", "")
															.replace(",", ".")
													);
													return (acc += curr);
												},
												0
											)
											.toLocaleString("pt-br", {
												style: "currency",
												currency: "BRL",
											})}
									</span>
								</div>
							</PopoverBody>
						</Popover>
					);
				}}
			</Overlay>
		</>
	);
};

export default ProdutosTable;
