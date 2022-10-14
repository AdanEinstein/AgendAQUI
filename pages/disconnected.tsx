import { useRouter } from "next/router"
import { Button } from "react-bootstrap"
import useAuth from "../auth/auth"
import Card from "../components/layout/Card"
import Layout from "../components/layout/Layout"

const Disconnected: React.FC = () => {
    const route = useRouter()
    return (
        <Layout>
            <Card className="d-flex flex-column align-items-center justify-content-around">
                <h1 className="display-1">Session disconnected</h1>
                <p>Por favor, faça o login novamente para ter o acesso novamente!</p>
                <Button
                    variant="warning"
                    size={'lg'}
                    onClick={() => route.push('/')}
                >Voltar à página inicial</Button>
            </Card>
        </Layout>
    )
}

export default Disconnected