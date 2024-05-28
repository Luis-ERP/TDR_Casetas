import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import useSession from "../hooks/useSession";

export default function LoginPage() {
    const { login } = useSession();

    return (
        <Container style={{ height: '100vh' }}>
            <Row className="d-flex align-items-center justify-content-center">
                <Col md={6}>
                    <Card style={{  }}>
                        <CardBody className="p-5">
                            <h2 className="text-center">Iniciar sesión</h2>
                            <Form onSubmit={login}>
                                <FormGroup>
                                    <Label htmlFor="user">Usuario Televía</Label>
                                    <Input type="text" className="form-control" id="user" />
                                </FormGroup>
                                <FormGroup className="mt-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input type="password" className="form-control" id="password" />
                                </FormGroup>
                                <div className="d-flex justify-content-center">
                                    <Button type="submit" className="btn btn-primary">Iniciar sesión</Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
