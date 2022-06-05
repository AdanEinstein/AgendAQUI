import styles from "/styles/Input.module.css"

interface Props {
	id: string;
	label: string;
	placeholder?: string;
	type: string;
}

const Input: React.FC<Props> = ({ id, label, type, placeholder }) => {
	return (
		<div className={styles.Input}>
			<label htmlFor={id}>{label}</label>
			<input id={id} type={type} placeholder={placeholder || ""} />
		</div>
	);
};

export default Input;
