import axios from "axios";
import {MouseEvent, useEffect, useState} from "react";
import {Row, Spinner} from "react-bootstrap";
import {Button, Container, Table} from "react-bootstrap";
import {IPrestador} from "../../../@types/Models";
import {profileEnv} from "../../../auth/baseUrl";
import MyModal from "../../layout/Modal";
import DescricaoTable from "./DescricaoTable";
import ProdutosPrestadorTable from "./ProdutosPrestadorTable";

type Telas = "calendario" | "todo" | "search";

interface IListPrestadores {
    search: string;
    page: number;

    setPage(arg: number): void;

    setAgendado(arg: IPrestador): void;

    setShowTela(arg: Telas): void;
}

const ListPrestadores: React.FC<IListPrestadores> = ({
                                                         search,
                                                         page,
                                                         setPage,
                                                         setAgendado,
                                                         setShowTela,
                                                     }) => {
    const [prestadores, setPrestadores] = useState<IPrestador[]>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalAlert, setShowModalAlert] = useState<boolean>(false);
    const [select, setSelect] = useState<IPrestador>(null);

    useEffect(() => {
        const searchPrestadores = async () => {
            const data = await axios.post(
                `${profileEnv.baseUrl}/searchprestadores`,
                {nome: search, page},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return data.data;
        };
        searchPrestadores()
            .then((data) => {
                if (typeof data == "string") {
                    setPrestadores([]);
                } else {
                    setPrestadores(data);
                }
            })
            .catch((err) => {
                setPrestadores([]);
            });
    }, [search, page]);

    const handleConfirm = () => {
        setAgendado(select);
        setShowTela("calendario");
    };

    return prestadores ? (
        <Container>
            <Table className="table-light">
                <thead className="table-dark">
                <tr>
                    <th style={{width: "35%"}}>Nome</th>
                    <th style={{width: "10%"}}>Telefone</th>
                    <th style={{width: "25%"}}>Categoria</th>
                    <th
                        style={{width: "10%"}}
                        className="d-md-table-cell d-none"
                    >
                        Descrição
                    </th>
                    <th
                        style={{width: "10%"}}
                        className="d-md-table-cell d-none"
                    >
                        Produtos
                    </th>
                    <th style={{width: "20%"}}>Ações</th>
                </tr>
                </thead>
                <tbody>
                {prestadores?.map((pre) => {
                    return (
                        <tr key={pre.id}>
                            <td
                                className="d-sm-table-cell d-none"
                                style={{width: "35%"}}
                            >
                                {pre.nome.length >= 30
                                    ? pre.nome.split("", 30).join("") +
                                    "..."
                                    : pre.nome}
                            </td>
                            <td
                                className="d-table-cell d-sm-none"
                                style={{width: "45%"}}
                            >
                                {pre.nome.length >= 17
                                    ? pre.nome.split("", 17).join("") +
                                    "..."
                                    : pre.nome}
                            </td>
                            <td style={{width: "10%"}}>
                                {pre.telefone || "Não informado"}
                            </td>
                            <td style={{width: "25%"}}>
                                {pre.categoria || "Não informado"}
                            </td>
                            <DescricaoTable prestador={pre}/>
                            <ProdutosPrestadorTable prestador={pre}/>
                            <td style={{width: "25%"}}>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setSelect(oldPre => {
                                            if (pre.produtos.length > 0) {
                                                setShowModal(true);
                                            } else {
                                                setShowModalAlert(true);
                                            }
                                            return pre
                                        });
                                    }}
                                >
                                    Agendar{" "}
                                    <i className="bi bi-calendar-check-fill"></i>
                                </Button>
                            </td>
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
                        disabled={prestadores.length !== 10}
                        onClick={() => {
                            if (prestadores.length !== 0) {
                                setPage(page + 1);
                            }
                        }}
                    >
                        Próximo <i className="bi bi-chevron-right"></i>
                    </Button>
                </div>
            </div>
            {showModal && (
                <MyModal
                    title="Deseja realmente se agendar com"
                    labelbutton="Sim, eu quero"
                    show={showModal}
                    onHide={() => {
                        setShowModal(false);
                        setLoading(false);
                    }}
                    onConfirm={handleConfirm}
                >
                    <h4>{select.nome}</h4>
                </MyModal>
            )}
            {showModalAlert && (
                <MyModal
                    title="Atenção"
                    show={showModalAlert}
                    onHide={() => {
                        setShowModalAlert(false);
                        setLoading(false);
                    }}
                >
                    <p>
                        Infelizmente você não pode agendar-se com{" "}
                        <span className="text-danger fw-bolder">
							{select.nome}
						</span>{" "}
                        pois não há produtos para ofertar para você :(
                    </p>
                </MyModal>
            )}
        </Container>
    ) : (
        <Container className="d-flex justify-content-center">
            <Spinner animation="grow" variant="warning"/>
        </Container>
    );
};

export default ListPrestadores;
