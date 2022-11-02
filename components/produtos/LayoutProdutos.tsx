import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, FormControl } from "react-bootstrap";
import { ICliente, ILogin, IPrestador, IProduto } from "../../@types/Models";
import { useUser } from "../../contexts/UserContext";
import Card from "../layout/Card";
import Layout from "../layout/Layout";
import Nav from "../layout/Nav";
import styles from "./LayoutProduto.module.css";
import shortid from "shortid";
import { Container } from "react-bootstrap/lib/Tab";

const LayoutProdutos: React.FC = () => {
	const route = useRouter();
	const { links, typeUser, user } = useUser();
	const valorRef = useRef<HTMLInputElement>(null);
	const [produtos, setProdutos] = useState<IProduto[]>([]);

	useEffect(() => {
		if ((user as IPrestador)?.produtos) {
			setProdutos((user as IPrestador).produtos);
		}
	}, [typeUser]);

	const handlePrice = (valor: string) => {
		const val = valor.replace(/\D/g, "");
		const valFixed = `${(parseInt(val) / 100).toFixed(2)}`;
		if (val.length < 18) {
			const result = valFixed
				.replace(".", ",")
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
			valor = isNaN(parseInt(val) / 100) ? "0,00" : result;
		}
		return valor;
	};

	const handleAdd = () => {
		if (produtos.length === 0) {
			setProdutos([
				{ id: shortid(), descricao: undefined, preco: "0,00" },
			]);
		} else {
			setProdutos((oldProdutos) => [
				...oldProdutos,
				{ id: shortid(), descricao: undefined, preco: "0,00" },
			]);
		}
	};

	const handleTrash = (produto: IProduto) => {
		setProdutos((oldProdutos) => {
			return oldProdutos.filter((p) => p.id !== produto.id);
		});
	};

	const handleChange = (
		e: ChangeEvent,
		produto: IProduto,
		campo: "descricao" | "preco"
	) => {
		(e.target as HTMLInputElement).value =
			campo === "preco"
				? handlePrice((e.target as HTMLInputElement).value)
				: (e.target as HTMLInputElement).value;
		setProdutos((oldProdutos) => {
			return oldProdutos.map((p) => {
				if (p.id === produto.id) {
					return {
						...p,
						[campo]: (e.target as HTMLInputElement).value,
					};
				} else {
					return { ...p };
				}
			});
		});
	};
	return (
		<Layout>
			<Nav links={links} />
			<Card>
				<div className="row h-100">
					<div className="col-md-3 col-sm-1"></div>
					<div className="col-md-6 col-sm-10 d-flex align-items-center justify-content-center">
						{produtos.length !== 0 ? (
							<div>
								<div className="d-flex my-2 align-items-center">
									<h4 className="flex-grow-1 text-white m-0">
										Produtos:
									</h4>
									<Button onClick={() => handleAdd()}>
										Adicionar
									</Button>
								</div>
								<div className={styles.Lista + " px-4"}>
									{produtos?.map((current) => {
										return (
											<div
												key={current.id}
												className="d-flex flex-md-row flex-column my-4 p-3 bg-light bg-opacity-25 position-relative"
												style={{ borderRadius: "1rem" }}
											>
												<FloatingLabel
													className="flex-grow-1 m-1 text-black"
													label="Descrição"
												>
													<FormControl
														value={current.descricao}
														onChange={(
															e: ChangeEvent
														) =>
															handleChange(
																e,
																current,
																"descricao"
															)
														}
													/>
												</FloatingLabel>
												<FloatingLabel
													className="flex-grow-1 m-1 text-black"
													label="Valor R$"
												>
													<FormControl
														value={current.preco}
														onChange={(
															e: ChangeEvent
														) =>
															handleChange(
																e,
																current,
																"preco"
															)
														}
													/>
												</FloatingLabel>
												<Button
													className="position-absolute"
													variant="danger"
													style={{ top: -10, right: -10 }}
													onClick={() =>
														handleTrash(current)
													}
												>
													<i className="bi bi-trash-fill"></i>
												</Button>
											</div>
										);
									})}
								</div>
							</div>
						) : (
							<div className="d-flex flex-column">
								<div
									className="bg-black bg-gradient p-4 m-1 mb-3"
									style={{ borderRadius: 15 }}
								>
									<h2 className="d-none d-md-block text-white">
										<i className="bi bi-info-circle"></i> Não
										encontramos nenhum produto
									</h2>
									<h2 className="d-md-none d-block text-white">
										<i className="bi bi-info-circle"></i> Nenhum
										produto
									</h2>
								</div>
								<Button
									variant="primary"
									size="lg"
									onClick={() => handleAdd()}
								>
									Adicionar novo
								</Button>
							</div>
						)}
					</div>
					<div className="col-md-3 col-sm-1"></div>
				</div>
			</Card>
		</Layout>
	);
};

export default LayoutProdutos;
