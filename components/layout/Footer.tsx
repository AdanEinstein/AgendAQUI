import Link from "next/link"
import styles from "/styles/Footer.module.css"
const Footer: React.FC = () => {
    return (
        <footer className={styles.Footer}>
            <p className="m-0">&copy; Todos os direitos reservados -
                <Link href={'https://www.linkedin.com/in/adaneinstein/'}>
                    <span className="link-primary" style={{cursor: "pointer"}}>{' '}Adan Einstein <i className="bi bi-linkedin"></i></span>
                </Link>
            </p>
        </footer>
    )
}

export default Footer