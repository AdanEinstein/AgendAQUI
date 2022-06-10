import { MouseEventHandler, PropsWithChildren } from "react";
import { ModalProps } from "react-bootstrap";
import {
	Button,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
    Modal
} from "react-bootstrap";
import styles from "/styles/Modal.module.css";

interface Props {
	title: string;
	labelbutton: string;
	onConfirm?: MouseEventHandler<HTMLInputElement>;
}

const MyModal: React.FC<ModalProps & Props> = (props) => {
	return (
		<Modal
			className={styles.Modal}
			size="lg"
			aria-labelledby="meuModal"
			centered
			onHide={props.onHide}
            {...props}
		>
			<ModalHeader
				closeButton
				closeVariant="white"
				className={styles.ModalTop}
			>
				<ModalTitle id="meuModal" className="text-light">{props.title}</ModalTitle>
			</ModalHeader>
			<ModalBody className={styles.ModalCorpo}>
				{props.children}
			</ModalBody>
			<ModalFooter className={styles.ModalBottom}>
				<Button variant="warning" onClick={props.onConfirm}>
					{props.labelbutton}
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default MyModal;
