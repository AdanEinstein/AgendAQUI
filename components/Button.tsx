import { ButtonHTMLAttributes, DOMAttributes, EventHandler } from "react";
import styles from "/styles/Button.module.css"

interface Props {
    value: string;
    rest?: DOMAttributes<any>
}

const Button: React.FC<Props> = ({ value, ...rest }) => {
	return <button className={styles.Button} {...rest}>{value}</button>;
};

export default Button;
