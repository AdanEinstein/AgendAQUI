import styles from "/styles/Card.module.css"

const Card: React.FC<any> = ({ children }) => {
    return (
        <div className={styles.Card}>
            {children}
        </div>
    )
}

export default Card