import { useRouter } from "next/router"
import { Button } from "react-bootstrap"
import useAuth from "../auth/useAuth"
import Card from "../components/layout/Card"
import Layout from "../components/layout/Layout"

const NotFound: React.FC = () => {
    const route = useRouter()
    return (
        <Layout>
            <Card className="d-flex flex-column align-items-center justify-content-around">
                <h1 className="display-1">404 - Page not found</h1>
                <Button
                    variant="warning"
                    size={'lg'}
                    onClick={() => route.push('/')}
                >Voltar à página inicial</Button>
            </Card>
        </Layout>
    )
}

export default NotFound