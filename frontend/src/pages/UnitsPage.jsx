import { useState, useEffect } from "react";
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    CardBody,
    Button,
    FormGroup,
    Input,
    Table
} from "reactstrap";
import { useSearchParams } from "react-router-dom";

import { getUnits } from "../client/units";

export default function UnitsPage(props) {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        getUnits({ 'start_dt': startOfMonth.toISOString(), 'end_dt': endOfMonth.toISOString() }).then((data) => {
            setUnits(data);
        });
    }, []);

    return (
        <Container className='units-page'>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row className='mb-4'>
                                <Col>
                                    <h4>
                                       Económicos
                                    </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={2}>
                                    <FormGroup>
                                        <Input type="select" name="mes" id="mes" defaultValue={new Date().getMonth()+1}>
                                            <option value="">Mes</option>
                                            <option value="1">Enero</option>
                                            <option value="2">Febrero</option>
                                            <option value="3">Marzo</option>
                                            <option value="4">Abril</option>
                                            <option value="5">Mayo</option>
                                            <option value="6">Junio</option>
                                            <option value="7">Julio</option>
                                            <option value="8">Agosto</option>
                                            <option value="9">Septiembre</option>
                                            <option value="10">Octubre</option>
                                            <option value="11">Noviembre</option>
                                            <option value="12">Diciembre</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg={2}>
                                    <FormGroup>
                                        <Input type="select" name="año" id="año" defaultValue="2024">
                                            <option value="">Año</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg={2}>
                                    <FormGroup>
                                        <Input type="select" name="año" id="año" defaultValue="2024">
                                            <option value="">Semana</option>
                                            {[...Array(52).keys()].map((i) => {
                                                return <option key={i} value={i+1}>{i+1}</option>
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Table
                                    hover
                                    responsive
                                    size="sm"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Unidad</th>
                                                <th>Tag</th>
                                                <th>Órdenes</th>
                                                <th>Cruces</th>
                                                <th>Costo total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {units.map((unit) => {
                                                return (
                                                    <tr key={unit.id}>
                                                        <td>{unit.numero}</td>
                                                        <td>{unit.tag}</td>
                                                        <td>{unit.ordenes}</td>
                                                        <td>{unit.cruces}</td>
                                                        <td>${unit.total_cost}</td>
                                                    </tr>
                                                );
                                            })}                                            
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col md={12}>
                                    <p>Gráfica de comparativa de costos por trailer</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            
            <Row className="mt-3">
                <Col>
                    <Card>
                        <CardBody>
                            <Row className='mb-4'>
                                <Col>
                                    <h4>
                                        Buscar órdenes
                                    </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={1}>
                                    <Button color="primary">Buscar</Button>
                                </Col>
                                <Col lg={5}>
                                    <FormGroup>
                                        <Input type="text" name="search" id="search" placeholder="Buscar ordenes de la unidad" />
                                    </FormGroup>
                                </Col>
                                <Col lg={3}>
                                    <FormGroup>
                                        <Input type="select" name="mes" id="mes">
                                            <option value="">Mes</option>
                                            <option value="1">Enero</option>
                                            <option value="2">Febrero</option>
                                            <option value="3">Marzo</option>
                                            <option value="4">Abril</option>
                                            <option value="5">Mayo</option>
                                            <option value="6">Junio</option>
                                            <option value="7">Julio</option>
                                            <option value="8">Agosto</option>
                                            <option value="9">Septiembre</option>
                                            <option value="10">Octubre</option>
                                            <option value="11">Noviembre</option>
                                            <option value="12">Diciembre</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg={3}>
                                    <FormGroup>
                                        <Input type="select" name="año" id="año">
                                            <option value="">Año</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table
                                    hover
                                    responsive
                                    size="sm"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Orden</th>
                                                <th>Fecha</th>
                                                <th>Fecha de inicio del viaje</th>
                                                <th>Fecha de fin del viaje</th>
                                                <th>Origen</th>
                                                <th>Destino</th>
                                                <th>Casetas cobradas</th>
                                                <th>Costo total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1336155</td>
                                                <td>-</td>
                                                <td>02 ene 2023</td>
                                                <td>02 ene 2023</td>
                                                <td>Colgate Iturbide</td>
                                                <td>Servicio Comercial Garis</td>
                                                <td>2</td>
                                                <td>$415.00</td>
                                            </tr>
                                            <tr>
                                                <td>1336156</td>
                                                <td>-</td>
                                                <td>02 ene 2023</td>
                                                <td>02 ene 2023</td>
                                                <td>Colgate Iturbide</td>
                                                <td>Productos de consumo Z</td>
                                                <td>4</td>
                                                <td>$1,112.00</td>
                                            </tr>
                                            <tr>
                                                <td>1336157</td>
                                                <td>-</td>
                                                <td>02 ene 2023</td>
                                                <td>02 ene 2023</td>
                                                <td>Colgate Iturbide</td>
                                                <td>Cedis Colgate Tultitlán</td>
                                                <td>3</td>
                                                <td>$563.00</td>
                                            </tr>
                                            <tr>
                                                <td>1336609</td>
                                                <td>-</td>
                                                <td>01 ene 2023</td>
                                                <td>01 ene 2023</td>
                                                <td>Colgate Iturbide</td>
                                                <td>Cedis Colgate Tultitlán</td>
                                                <td>3</td>
                                                <td>$563.00</td>
                                            </tr>
                                            
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}