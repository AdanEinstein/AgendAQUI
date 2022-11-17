import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {Button, Collapse} from "react-bootstrap";
import {profileEnv} from "../../auth/baseUrl";
import styles from "/styles/Nav.module.css";
import MyModal from "./Modal";
import {useUser} from "../../contexts/UserContext";
import FeedbackText, {IFeedback} from "../utils/FeedbackText";

export interface ILink {
    label: string;
    link: string;
}

interface Props {
    links: ILink[];
}

const feedbackDefault = {
    icon: "bi bi-info-circle",
    message: "Digite corretamente as informações",
    color: "text-primary",
};

const Nav: React.FC<Props> = ({links}) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [showModalAlert, setShowModalAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<IFeedback>(null);
    const route = useRouter();
    const {user, typeUser} = useUser();

    useEffect(() => {
        const valid = async () => {
            try {
                const token = await axios.get(`${profileEnv.baseUrl}/validtoken`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                return token.status == 200 ? true : false;
            } catch (error) {
                return false
            }
        };
        valid().then(v => {
            if (!v) {
                route.push("/disconnected");
            }
        })
    }, []);

    // const handleDeletar = useCallback(() => {
    //     setLoading(true)
    //     axios.post(`${profileEnv.baseUrl}/deletarconta`, {id: user.id, tipo: typeUser}, {
    //         headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    //     }).then(() => {
    //         setFeedback({
    //             icon: "bi bi-check-circle",
    //             message: "Deletado com sucesso!",
    //             color: "text-success",
    //         })
    //         setLoading(false)
    //         route.push("/")
    //     }).catch(err => {
    //         setFeedback({
    //             icon: "bi bi-exclamation-diamond-fill",
    //             message: err.response.data,
    //             color: "text-danger",
    //         })
    //         setLoading(false)
    //     })
    // }, [user])

    return (
        <>
            <Collapse
                in={menuOpen}
                dimension={"width"}
                timeout={1}
                className={styles.container}
            >
                <nav className={styles.Nav}>
                    {links.map((link) => {
                        return (
                            <Link key={link.label} href={link.link}>
                                <a className={styles.link}>{link.label}</a>
                            </Link>
                        );
                    })}
                    {/*<Link*/}
                    {/*    href={""}*/}
                    {/*>*/}
                    {/*    <a className={styles.deletar}*/}
                    {/*       onClick={() => setShowModalAlert(true)}*/}
                    {/*    >Deletar conta <i className="bi bi-trash3-fill"></i></a>*/}
                    {/*</Link>*/}
                </nav>
            </Collapse>
            <Button
                className={menuOpen ? styles.menuOpen : styles.menuClosed}
                variant="warning"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {!menuOpen && "Menu"}
                <i className="bi bi-list"></i>
            </Button>
            {/*{showModalAlert && (*/}
            {/*    <MyModal*/}
            {/*        title="Atenção"*/}
            {/*        show={showModalAlert}*/}
            {/*        onHide={() => {*/}
            {/*            setShowModalAlert(false);*/}
            {/*        }}*/}
            {/*        labelbutton={loading ? null : "Sim, eu quero"}*/}
            {/*        onConfirm={loading ? null : handleDeletar}*/}
            {/*    >*/}
            {/*        <h4>Deseja mesmo deletar sua conta?</h4>*/}
            {/*        {feedback ? (<FeedbackText feedback={feedback}/>) : (*/}
            {/*            <>*/}
            {/*                <p>*/}
            {/*                    Essa ação é irreversível hein...*/}
            {/*                </p>*/}
            {/*                <p className="text-danger fw-bolder">Pense bem!</p>*/}
            {/*            </>*/}
            {/*        )}*/}
            {/*    </MyModal>*/}
            {/*)}*/}
        </>
    );
};

export default Nav;
