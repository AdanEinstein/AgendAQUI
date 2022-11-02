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
    Row,
} from "react-bootstrap";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { IProductSchedule, ISchedule } from "./ISchedule";
import { IAcoes } from "./LayoutSchedule";
import shortid from "shortid";
import styles from "./FormSchedule.module.css";
import * as yup from "yup";
import FeedbackText, { IFeedback } from "../../utils/FeedbackText";

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
        matches: "Horário inválido",
    },
});

const schema = yup.object().shape({
    produto: yup.array().min(1).required().label("Lista de produtos"),
    cliente: yup.string().required().label("Cliente"),
    horario: yup
        .string()
        .matches(/([01][0-9]|2[0-3]):[0-5][0-9]/)
        .required()
        .label("Horário"),
});

const schemaProduto = yup.object().shape({
    descricao: yup.string().required().label("Descrição"),
    valor: yup.string().required().label("Valor"),
});

const feedbackDefault: IFeedback = {
    icon: "bi bi-info-circle-fill",
    message: "Digite as informações corretamente!",
    color: "text-primary",
};

const FormSchedule: React.FC<IAcoes> = ({ target, setTarget, setTelas }) => {
    const [feedback, setFeedback] = useState<IFeedback>(feedbackDefault);
    const [horario, setHorario] = useState<string>("");
    const [cliente, setCliente] = useState<string>("");
    const horarioRef = useRef<HTMLInputElement>(null);
    const clienteRef = useRef<HTMLInputElement>(null);
    const { ano, mes, dia } = useSchedule();
    const [produtos, setProdutos] = useState<IProductSchedule[]>(
        target?.schedule.produto || []
    );

    useEffect(() => {
        horarioRef.current?.focus();
        setHorario(target?.schedule.horario || "");
        setCliente(target?.schedule.cliente || "");
    }, [target]);

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
                { id: shortid(), descricao: undefined, valor: "0,00" },
            ]);
        } else {
            setProdutos((oldProdutos) => [
                ...oldProdutos,
                { id: shortid(), descricao: undefined, valor: "0,00" },
            ]);
        }
    };

    const handleTrash = (produto: IProductSchedule) => {
        setProdutos((oldProdutos) => {
            return oldProdutos.filter((p) => p.id !== produto.id);
        });
    };

    const handleChange = (
        e: ChangeEvent,
        produto: IProductSchedule,
        campo: "descricao" | "valor"
    ) => {
        (e.target as HTMLInputElement).value =
            campo === "valor"
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

    const handleConfirm = useCallback(() => {
        if (setTelas && clienteRef.current && horarioRef.current && target) {
            
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
            <FloatingLabel className="mb-3" label="Cliente">
                <FormControl
                    ref={clienteRef}
                    disabled={target?.estado === "deletar"}
                    value={cliente}
                    onChange={(e: ChangeEvent) =>
                        setCliente((e.target as HTMLInputElement).value)
                    }
                />
            </FloatingLabel>
            <FeedbackText feedback={feedback} />
            <div className="d-flex my-2 align-items-center">
                <h4 className="flex-grow-1 text-white m-0">Produtos:</h4>
                <Button
                    disabled={target?.estado === "deletar"}
                    onClick={() => handleAdd()}
                >
                    Adicionar
                </Button>
            </div>
            <div className={"container " + styles.Lista}>
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
                                    disabled={target?.estado === "deletar"}
                                    value={current.descricao}
                                    onChange={(e: ChangeEvent) =>
                                        handleChange(e, current, "descricao")
                                    }
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                className="flex-grow-1 m-1 text-black"
                                label="Valor R$"
                            >
                                <FormControl
                                    disabled={target?.estado === "deletar"}
                                    value={current.valor}
                                    onChange={(e: ChangeEvent) =>
                                        handleChange(e, current, "valor")
                                    }
                                />
                            </FloatingLabel>
                            <Button
                                className="position-absolute"
                                disabled={target?.estado === "deletar"}
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
