import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import '../styles/homepage.scss';


export default function HomePage(props) {
    return (
        <Container className='home-page'>
            <Row>
                <Col>
                    <Card className='costs-per-month-card'>
                        <CardBody>
                            <p>Grafica de barras con el costo real gastado por mes</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className='costs-per-week-card'>
                        <CardBody>
                            <p>Grafica de barras con el costo real gastado por semana</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className='costs-per-unit-card'>
                        <CardBody>
                            <p>Tabla con los gastos por unidad / económico</p>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card className='costs-per-order-card'>
                        <CardBody>
                            <p>Tabla con los gastos por orden</p>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card className='costs-per-route-card'>
                        <CardBody>
                            <p>Tabla con los gastos por ruta</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
