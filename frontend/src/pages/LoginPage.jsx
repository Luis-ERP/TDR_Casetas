import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import useSession from "../hooks/useSession";
import Swal from 'sweetalert2';
import Logo from '../assets/logo-tdr.png';
import '../styles/login.scss';

export default function LoginPage() {
    const { login, token } = useSession();

    const onSubmitHanlder = async (e) => {
        e.preventDefault();
        let user = e.target.user.value;
        let password = e.target.password.value;

        // Remove spaces from user and password
        user = user.replace(/\s/g, '');
        password = password.replace(/\s/g, '');

        try {
            parseInt(user);
        } catch (error) {
            Swal.fire({
                title: '¡Error!',
                text: 'El usuario debe ser un número',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        Swal.fire({
            title: 'Iniciando sesión...',
            showConfirmButton: false,
            allowOutsideClick: false
        });
        try {
            await login(user, password);
	        console.log('LoginPage: ', token);
            Swal.fire({
                title: '¡Bienvenido!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            Swal.fire({
                title: '¡Error!',
                text: 'Usuario o contraseña incorrectos',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    return (
        <div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center bg-gradient-anim bg-gray-100">
            <Row>
                <Col md={6}>
                    <Card style={{ width: '40vw' }}>
                        <CardBody className="p-5">
                            <img src={Logo} alt="TDR transportes logo" className="img-fluid d-block mx-auto" style={{ width: '200px' }} />

                            <Form onSubmit={onSubmitHanlder}>
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
        </div>
    );
}
