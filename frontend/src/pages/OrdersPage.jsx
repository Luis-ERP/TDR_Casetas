import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    FormGroup, 
    Input, 
    Card, 
    CardBody, 
    Button, 
    Form 
} from 'reactstrap';
import { IoCloudUpload } from "react-icons/io5";
import { getCruces } from '../client/cruces';
import UploadOrdersModal from '../modals/UploadOrdersModal';


export default function OrdersPage(props) {
	const [order, setOrder] = useState();
    const [cruces, setCruces] = useState();
    const [isUploadOrdersModalOpen, setIsUploadOrdersModalOpen] = useState(false);

    const onSubmitSearchOrder = (event) => {
		event.preventDefault();

		const orderId = event.target.search.value;
		axios.get(`http://127.0.0.1:8002/casetas/ordenes/${orderId}/`)
		.then(response => {
			if (response.data?.length === 0)
				alert('No se encontró la orden');

			setOrder(response.data);
		})
		.catch(error => {
			alert('Error al buscar la orden');
		});
	};

    useEffect(() => {
        if (!order) return;
        getCruces({ orden: order.numero })
        .then(data => {
            data = data.sort((x, y) => new Date(x.fecha) <= new Date(y.fecha) ? 1 : -1)
                       .map(x => ({ ...x, fecha: new Date(x.fecha).toLocaleDateString() }));
            setCruces(data);
        });
    }, [order]);

    return (
    <Container>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <Row className='mb-4'>
                            <Col>
                                <h4>
                                    Información por orden
                                </h4>
                            </Col>
                            <Col className='d-flex justify-content-end'>
                                <Button
                                    color='primary'
                                    onClick={() => setIsUploadOrdersModalOpen(true)}
                                >
                                    <IoCloudUpload className='m-2' />
                                    <span>Importar órdenes</span>
                                </Button>
                            </Col>
                        </Row>
                        <Form onSubmit={onSubmitSearchOrder}>
                            <Row>
                                <Col lg={1}>
                                    <Button color="primary">Buscar</Button>
                                </Col>
                                <Col lg={6}>
                                    <FormGroup>
                                        <Input type="text" name="search" id="search" placeholder="Buscar orden" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                        <Row>
                            <Col lg={3}>
                                <Table
                                responsive
                                size="sm"
                                >
                                        {order &&
                                            <tbody> 
                                                <tr>
                                                    <th>Orden</th>
                                                    <th>{order.numero}</th>
                                                </tr>
                                                <tr>
                                                    <th>Tag</th>
                                                    <td>{order.unidad.tag}</td>
                                                </tr>
                                                <tr>
                                                    <th>Origen</th>
                                                    <td>{order.lugar_origen.nombre}</td>
                                                </tr>
                                                <tr>
                                                    <th>Destino</th>
                                                    <td>{order.lugar_destino.nombre}</td>
                                                </tr>
                                                <tr>
                                                    <th>Costo total esperado</th>
                                                    <td>$ {parseInt(order.costo_esperado)}.00</td>
                                                </tr>
                                                <tr>
                                                    <th>Costo total real</th>
                                                    <td>$ {parseInt(order.costo_total)}.00</td>
                                                </tr>
                                                <tr>
                                                    <th>Costo diferencia</th>
                                                    <td>$ {parseInt(order.diferencia)}.00</td>
                                                </tr>
                                            </tbody>
                                        }
                                </Table>
                            </Col>
                            <Col lg={1} />
                            <Col lg={8}>
                                {order &&
                                    <>
                                        <h5>Detalle de cruces</h5>
                                        <Table
                                        hover
                                        responsive
                                        size="sm"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Caseta</th>
                                                    <th>Costo Global Maps</th>
                                                    <th>Costo Televía</th>
                                                    <th>Diferencia</th>
                                                    <th>Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cruces != null && 
                                                    cruces.length > 0 ?
                                                        cruces.map(cruce => (
                                                            <tr>
                                                                <td>{cruce.caseta?.nombre}</td>
                                                                <td>$ {cruce.costo_esperado}.00</td>
                                                                <td>$ {cruce.costo}.00</td>
                                                                <td>$ {cruce.diferencia}.00</td>
                                                                <td>{cruce.fecha}</td>
                                                            </tr>
                                                        ))
                                                    : <tr><td>No se encontraron cruces para esta orden.</td></tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>

        <UploadOrdersModal
            isOpen={isUploadOrdersModalOpen}
            toggle={() => setIsUploadOrdersModalOpen(!isUploadOrdersModalOpen)}
        />

    </Container>
    )
}