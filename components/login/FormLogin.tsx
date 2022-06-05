import Button from "../Button";
import Input from "../Input";
import styles from "./FormLogin.module.css";

const FormLogin: React.FC<any> = () => {
	return (
		<div className={styles.container}>
			<div className={styles.FormLogin}>
				<div className={styles.saudacao}>
					<h2>Bem vindo!</h2>
					<h3> Faça o seu login</h3>
					<hr />
				</div>
				<Input
					id="login"
					label="Login"
					type="text"
					placeholder="Digite o login"
				/>
				<Input
					id="senha"
					label="Senha"
					type="Passoword"
					placeholder="Digite a senha"
				/>
				<div className={styles.botoes}>
					<Button value="Entrar" />
				</div>
			</div>
		</div>
	);
};

export default FormLogin;
