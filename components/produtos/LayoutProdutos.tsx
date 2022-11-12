import { useRouter } from "next/router";
import {
	ChangeEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Button,
	ButtonGroup,
	FloatingLabel,
	FormControl,
} from "react-bootstrap";
import { ICliente, ILogin, IPrestador, IProduto } from "../../@types/Models";
import { useUser } from "../../contexts/UserContext";
import Card from "../layout/Card";
import Layout from "../layout/Layout";
import Nav from "../layout/Nav";
import styles from "./LayoutProduto.module.css";
import shortid from "shortid";
import * as yup from "yup";
import FeedbackText, { IFeedback } from "../utils/FeedbackText";
import MyModal from "../layout/Modal";
import { profileEnv } from "../../auth/baseUrl";
import axios from "axios";

yup.setLocale({
	mixed: {
		required(params) {
			return `${params.path} não foi preenchido`;
		},
	},
	array: {
		min(params) {
			return `${params.path} deve ter no mínimo ${params.min} produto`;
		},
	},
	string: {
		max(params) {
			return `${params.path} deve ter no máximo ${params.value} de tamanho`;
		},
		matches(params) {
			return `${params.path} não pode ser menor que R$ 1,00`;
		},
	},
});

const feedbackDefault = {
	icon: "bi bi-info-circle",
	message: "Digite corretamente as informações",
	color: "text-white fw-bolder",
};

const schema = yup.object().shape({
	produtos: yup
		.array()
		.of(
			yup.object().shape({
				preco: yup
					.string()
					.required()
					.matches(/^(?!0,??)/gm)
					.label("Preço"),
				descricao: yup
					.string()
					.required()
					.min(1)
					.max(40)
					.label("Descrição"),
				id: yup.string().required().label("Id"),
			})
		)
		.required()
		.label("Lista de produtos"),
});

const LayoutProdutos: React.FC = () => {
	const route = useRouter();
	const { links, user, setAtualizar, typeUser } = useUser();
	const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
	const [produtos, setProdutos] = useState<IProduto[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [alterado, setAlterado] = useState<boolean>(false);
	const [deletados, setDeletados] = useState<number[]>([]);

	useEffect(() => {
		if ((user as IPrestador)?.produtos && produtos.length >= 0) {
			setProdutos(() => {
				return (
					JSON.parse(localStorage.getItem("user")) as IPrestador
				).produtos.map((p) => {
					return { ...p, preco: handlePrice(p.preco) };
				});
			});
		}
	}, [user, alterado]);

	useEffect(() => {
		if (typeUser == "cliente" || typeUser == "login") {
			route.push("/_error");
		}
	}, []);

	const handlePrice = (valor: string | number): string => {
		const val =
			typeof valor == "string"
				? valor.replace(/\D/g, "")
				: valor.toString();
		const valFixed =
			typeof valor == "string"
				? `${(parseInt(val) / 100).toFixed(2)}`
				: `${parseInt(val).toFixed(2)}`;
		if (val.length < 18) {
			const result = valFixed
				.replace(".", ",")
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
			valor = isNaN(parseInt(val) / 100) ? "0,00" : result;
		}
		return valor as string;
	};

	const handleAdd = useCallback(() => {
		if (produtos.length === 0) {
			setProdutos([{ id: shortid(), descricao: "", preco: "0,00" }]);
		} else {
			setProdutos((oldProdutos) => [
				...oldProdutos,
				{ id: shortid(), descricao: "", preco: "0,00" },
			]);
		}
		setAlterado(true);
	}, [produtos]);

	const handleTrash = useCallback(
		(produto: IProduto) => {
			setProdutos((oldProdutos) => {
				return oldProdutos.filter((p) => p.id !== produto.id);
			});
			if (typeof produto.id == "number") {
				setDeletados((oldProdutos) => {
					return [...oldProdutos, produto.id as number];
				});
			}
		},
		[produtos, alterado, deletados]
	);

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

	const handleContinuar = useCallback(() => {
		setLoading(true);
		schema
			.validate({ produtos })
			.then(() => {
				setFeedback(feedbackDefault);
				setShowModal(true);
			})
			.catch((err: yup.ValidationError) => {
				setFeedback({
					icon: "bi bi-x-octagon-fill",
					message: err.errors,
					color: "text-danger",
				});
				setLoading(false);
			});
	}, [produtos]);

	const handleConfirm = useCallback(async () => {
		setShowModal(false);
		setLoading(true);
		try {
			const data = {
				produtos,
				prestadorId: (user as IPrestador).id,
				deletados: deletados.sort((a, b) => a - b),
			};
			console.warn(data)
			const posted = await axios.post(
				`${profileEnv.baseUrl}/setprodutos`,
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
				color: "text-success fw-bolder",
			});
			await localStorage.setItem(
				"user",
				JSON.stringify({ ...user, produtos: [...posted.data] })
			);
			setLoading(false);
			setAlterado(false);
			setAtualizar(true);
			setDeletados([]);
		} catch (err) {
			setFeedback({
				icon: "bi bi-exclamation-diamond-fill",
				message: err.response.data,
				color: "text-warning fw-bolder",
			});
			setLoading(false);
		}
	}, [produtos]);

	return (
		<>
			<Layout>
				<Nav links={links} />
				<Card>
					<div className="row h-100">
						<div className="col-md-2 col-sm-1"></div>
						<div className="col-md-8 col-sm-10 d-flex flex-column justify-content-center">
							{produtos.length !== 0 ? (
								<div>
									<div className="d-flex flex-column">
										{alterado && (
											<h4 className="flex-grow-1 text-white d-sm-none d-block ms-2">
												Produtos:
											</h4>
										)}
										<div className="d-flex ms-2 mt-3 justify-content-center">
											<h4
												className={`flex-grow-1 text-white ${
													alterado &&
													"d-none d-sm-block"
												}`}
											>
												Produtos:
											</h4>
											<ButtonGroup>
												{alterado ? (
													<>
														<Button
															onClick={() => {
																setAlterado(
																	false
																);
																setDeletados(
																	[]
																);
															}}
															variant="warning"
															disabled={loading}
														>
															Restaurar
														</Button>
														<Button
															onClick={() =>
																handleContinuar()
															}
															variant="success"
															disabled={loading}
														>
															Confirmar
														</Button>
														<Button
															onClick={() =>
																handleAdd()
															}
															disabled={loading}
															className="me-1"
														>
															Adicionar
														</Button>
													</>
												) : (
													<Button
														onClick={() =>
															setAlterado(true)
														}
														disabled={loading}
														className="me-1"
														variant="secondary"
													>
														Alterar
													</Button>
												)}
											</ButtonGroup>
										</div>
										<div className="ms-2">
											<FeedbackText feedback={feedback} />
										</div>
									</div>
									<div className={styles.Lista + " px-4"}>
										{produtos?.map((current) => {
											return (
												<div
													key={current.id}
													className="d-flex flex-md-row flex-column my-4 p-3 bg-light bg-opacity-25 position-relative"
													style={{
														borderRadius: "1rem",
													}}
												>
													<FloatingLabel
														className="flex-grow-1 m-1 text-black"
														label="Descrição"
													>
														<FormControl
															value={
																current.descricao
															}
															onChange={(
																e: ChangeEvent
															) =>
																handleChange(
																	e,
																	current,
																	"descricao"
																)
															}
															disabled={
																loading ||
																!alterado
															}
														/>
													</FloatingLabel>
													<FloatingLabel
														className="flex-grow-1 m-1 text-black"
														label="Valor R$"
													>
														<FormControl
															value={
																current.preco
															}
															onChange={(
																e: ChangeEvent
															) =>
																handleChange(
																	e,
																	current,
																	"preco"
																)
															}
															disabled={
																loading ||
																!alterado
															}
														/>
													</FloatingLabel>
													{alterado && (
														<Button
															className="position-absolute"
															variant="danger"
															style={{
																top: -10,
																right: -10,
															}}
															onClick={() =>
																handleTrash(
																	current
																)
															}
															disabled={loading}
														>
															<i className="bi bi-trash-fill"></i>
														</Button>
													)}
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
											<i className="bi bi-info-circle"></i>{" "}
											Não encontramos nenhum produto
										</h2>
										<h2 className="d-md-none d-block text-white">
											<i className="bi bi-info-circle"></i>{" "}
											Nenhum produto
										</h2>
									</div>
									<ButtonGroup>
										<Button
											variant="primary"
											size="lg"
											onClick={() => {
												handleAdd();
											}}
										>
											Adicionar novo
										</Button>
										{deletados.length > 0 && (
											<Button
												variant="success"
												size="lg"
												onClick={() =>
													handleContinuar()
												}
											>
												Confirmar
											</Button>
										)}
									</ButtonGroup>
								</div>
							)}
						</div>
						<div className="col-md-2 col-sm-1"></div>
					</div>
				</Card>
			</Layout>
			{/* Modal */}
			<MyModal
				title="Confirmação da lista de produtos"
				labelbutton="Confirmar"
				show={showModal}
				onHide={() => {
					setShowModal(false);
					setLoading(false);
				}}
				onConfirm={handleConfirm}
			>
				<h4>Deseja confirmar os dados?</h4>
			</MyModal>
		</>
	);
};

export default LayoutProdutos;
