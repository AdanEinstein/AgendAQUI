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
                <h1 className="display-2 d-none d-md-block">Session disconnected</h1>
                <h1 className="display-4 d-md-none d-block">Session disconnected</h1>
                <div className="fw-bold text-center d-none d-md-block fs-3">
                    <p>Por favor, faça o login novamente </p>
                    <p>para ter o acesso novamente!</p>
                </div>
                <div className="fw-bold text-center d-md-none d-block">
                    <p>Por favor, faça o login novamente </p>
                    <p>para ter o acesso novamente!</p>
                </div>
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