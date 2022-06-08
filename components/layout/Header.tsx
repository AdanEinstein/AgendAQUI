import styles from "/styles/Header.module.css";
const Header: React.FC = () => {
    return (
        <header className={styles.Header}>
            <h1><i className="bi bi-journal-check text-warning"></i> AgendAQUI</h1>
        </header>
    )
}

export default Header