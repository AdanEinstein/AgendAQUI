import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Button,
    Container,
    FloatingLabel,
    FormControl,
    FormSelect,
} from "react-bootstrap";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { ISchedule } from "./ISchedule";
import { IAcoes, ITargetAgendamento } from "./LayoutSchedule";
import shortid from "shortid";
import styles from "./FormSchedule.module.css";
import * as yup from "yup";
import FeedbackText, { IFeedback } from "../../utils/FeedbackText";
import { ICliente, IProduto } from "../../../@types/Models";
import { handlePrice } from "../../utils/utilsPrices";
import { useUser } from "../../../contexts/UserContext";
import axios, { AxiosError } from "axios";
import { profileEnv } from "../../../auth/baseUrl";

yup.setLocale({
    mixed: {
        required(params) {
            return `${params.path} não foi preenchido!`;
        },
    },
    array: {
        min: "Necessário pelo menos um produto",
    },
    string: {
        matches(params) {
            if (params.path == "Horário") {
                return "Horário inválido";
            } else {
                return "Preço não deve ser menor que R$ 1,00";
            }
        },
    },
});

const schema = yup.object().shape({
    produtos: yup
        .array()
        .of(
            yup.object().shape({
                descricao: yup.string().required().label("Descrição"),
                preco: yup
                    .string()
                    .required()
                    .matches(/^(?!0,??)/gm)
                    .label("Preço"),
            })
        )
        .min(1)
        .required()
        .label("Lista de produtos"),
    cliente: yup.string().required().label("Cliente"),
    prestador: yup.string().required().label("Prestador"),
    horario: yup
        .string()
        .matches(/([01][0-9]|2[0-3]):[0-5][0-9]/)
        .required()
        .label("Horário"),
    data: yup
        .string()
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/)
        .required()
        .label("Data"),
});

const feedbackDefault: IFeedback = {
    icon: "bi bi-info-circle-fill",
    message: "Digite as informações corretamente!",
    color: "text-primary",
};

const FormSchedule: React.FC<IAcoes> = ({
    target,
    setTarget,
    setTelas,
    setAgendado,
}) => {
    const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
    const [loading, setLoading] = useState<boolean>(false);
    const [horario, setHorario] = useState<string>("");
    const horarioRef = useRef<HTMLInputElement>(null);
    const { ano, mes, dia } = useSchedule();
    const { typeUser, setAtualizar } = useUser();
    const [produtos, setProdutos] = useState<IProduto[]>(
        target?.agendamento.produtos || []
    );

    useEffect(() => {
        horarioRef.current?.focus();
        setHorario(target?.agendamento.dataEHora.split(" ")[1] || "");
    }, [target]);

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

    const handleChange = (produto: IProduto, index: number) => {
        setProdutos((oldProdutos) => {
            return oldProdutos.map((p, i) => {
                if (index === i) {
                    return {
                        ...produto,
                    };
                } else {
                    return { ...p };
                }
            });
        });
    };

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        if (target) {
            const dataAgenda = {
                prestador: target.agendamento.prestador.nome,
                cliente: target.agendamento.cliente.nome,
                data: target.agendamento.dataEHora.split(" ")[0],
                horario: horarioRef.current.value,
                produtos,
            };
            try {
                await schema.validate(dataAgenda);
                const envio: ITargetAgendamento = {
                    ...target,
                    agendamento: {
                        ...target.agendamento,
                        dataEHora: `${
                            target.agendamento.dataEHora.split(" ")[0]
                        } ${horarioRef.current.value}`,
                        produtos,
                    },
                };
                await axios.post(
                    `${profileEnv.baseUrl}/setagendamento`,
                    { data: envio },
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
                    message: "Ação completa com sucesso!",
                    color: "text-success",
                });
                setLoading(false);
                setTarget(envio);
                setAgendado(null);
                setTelas("lista");
                setAtualizar(true);
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    setFeedback({
                        icon: "bi bi-exclamation-diamond-fill",
                        message: err.errors,
                        color: "text-danger",
                    });
                    setLoading(false);
                } else if (err instanceof AxiosError) {
                    setFeedback({
                        icon: "bi bi-exclamation-diamond-fill",
                        message: err.response.data,
                        color: "text-danger",
                    });
                    setLoading(false);
                } else {
                    setFeedback({
                        icon: "bi bi-exclamation-diamond-fill",
                        message: "Tivemos um problema!",
                        color: "text-danger",
                    });
                    setLoading(false);
                }
            }
        }
    }, [produtos]);

    return (
        <Container className="position-relative h-100 p-2">
            <FloatingLabel className="mb-3" label="Horário">
                <FormControl
                    type="time"
                    ref={horarioRef}
                    disabled={target?.estado === "deletar"}
                    value={horario}
                    onChange={(e: ChangeEvent) =>
                        setHorario((e.target as HTMLInputElement).value)
                    }
                />
            </FloatingLabel>
            <FloatingLabel className="mb-3" label="Prestador">
                <FormControl
                    disabled={true}
                    value={target.agendamento.prestador.nome}
                />
            </FloatingLabel>
            <FloatingLabel className="mb-3" label="Cliente">
                <FormControl
                    disabled={true}
                    value={target.agendamento.cliente.nome}
                />
            </FloatingLabel>
            <FeedbackText feedback={feedback} />
            <div className="d-flex my-2 align-items-center">
                <h4 className="flex-grow-1 text-white m-0">Produtos:</h4>
                {typeUser == "cliente" && (
                    <Button
                        disabled={target?.estado === "deletar"}
                        onClick={() => handleAdd()}
                    >
                        Adicionar
                    </Button>
                )}
            </div>
            <div className={"container " + styles.Lista}>
                {produtos?.map((current, i) => {
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
                                <FormSelect
                                    disabled={
                                        target?.estado === "deletar" ||
                                        typeUser !== "cliente" ||
                                        loading
                                    }
                                    value={current.descricao}
                                >
                                    <option>Selecione um produto</option>
                                    {target.agendamento.prestador.produtos
                                        .length > 0 &&
                                        target.agendamento.prestador.produtos.map(
                                            (p) => {
                                                return (
                                                    <option
                                                        id={`${p.id}`}
                                                        value={p.descricao}
														onPointerDown={() => {
															handleChange(p, i);
														}}
                                                    >
                                                        {p.descricao}
                                                    </option>
                                                );
                                            }
                                        )}
                                </FormSelect>
                            </FloatingLabel>
                            <FloatingLabel
                                className="flex-grow-1 m-1 text-black"
                                label="Valor R$"
                            >
                                <FormControl
                                    disabled={true}
                                    value={handlePrice(current.preco)}
                                />
                            </FloatingLabel>
                            <Button
                                className="position-absolute"
                                disabled={
                                    target?.estado === "deletar" ||
                                    typeUser !== "cliente" ||
                                    loading
                                }
                                variant="danger"
                                style={{ top: -10, right: -10 }}
                                onClick={() => handleTrash(current)}
                            >
                                <i className="bi bi-trash-fill"></i>
                            </Button>
                        </div>
                    );
                })}
            </div>
            <div className="w-100 d-flex">
                <Button
                    className="btn-lg flex-grow-1 mx-1"
                    variant="outline-danger"
                    onClick={() => setTelas && setTelas("lista")}
                >
                    Voltar
                </Button>
                <Button
                    className="btn-lg flex-grow-1 mx-1"
                    variant={
                        target?.estado === "novo"
                            ? "success"
                            : target?.estado === "editar"
                            ? "warning"
                            : "danger"
                    }
                    onClick={handleConfirm}
                >
                    {target?.estado === "novo"
                        ? "Novo"
                        : target?.estado === "editar"
                        ? "Editar"
                        : "Deletar"}
                </Button>
            </div>
        </Container>
    );
};

export default FormSchedule;
