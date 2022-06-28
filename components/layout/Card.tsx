import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "/styles/Card.module.css";

const Card: React.FC<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className }) => {
	return <div className={`${styles.Card} ${className}`}>{children}</div>;
};

export default Card;
