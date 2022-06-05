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
                <div className={styles.inputs}>
                    <label htmlFor="login">
                        Login
                        <input id="login" type="text" />
                    </label>
					<label htmlFor="senha">
						Senha
						<input type="password" id="senha" />
					</label>
                </div>
                <div className={styles.botoes}>
                    <button>Entrar</button>
                </div>
            </div>
        </div>
    );
};

export default FormLogin;
