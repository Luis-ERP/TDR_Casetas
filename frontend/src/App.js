import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, FormGroup, Input, Card, CardBody, Button, Form } from 'reactstrap';
import './App.css';

const data = {
	'id': 1,
	'number': '123456',
	'tag': 'ERTKGMLGKML235235',
	'origin': {
		'id': 1,
		'name': 'Bogota'
	},
	'destination': {
		'id': 2,
		'name': 'Medellin'
	},
}

function App() {
	const [order, setOrder] = useState(data);

	const onSubmitSearchOrder = (event) => {
		event.preventDefault();

		const orderId = event.target.search.value;
		axios.get(`http://127.0.0.1:8000/casetas/ordernes/${orderId}`)
		.then(response => {
			if (response.data?.length === 0)
				alert('No se encontró la orden');

			setOrder(response.data);
		})
		.catch(error => {
			alert('Error al buscar la orden');
		});
	};


return (
	<Container className="App">
		<Row className='m-4'>
			<span>
				<img src="https://www.tdr.com.mx/imagenes/logos/LOGO%20BLANCIO%20130X64.png" height={50} />
				<h2>Sistema de comparación de casetas</h2>
			</span>
		</Row>

		<Row className='mb-5'>
			<Col>
				<Card>
					<CardBody>
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
									<tbody>
										<tr>
											<th>Orden</th>
											<th>{order.number}</th>
										</tr>
										<tr>
											<th>Tag</th>
											<td>{order.tag}</td>
										</tr>
										<tr>
											<th>Origen</th>
											<td>{order.origin.name}</td>
										</tr>
										<tr>
											<th>Destino</th>
											<td>{order.destination.name}</td>
										</tr>
										<tr>
											<th>Costo Total Esperado</th>
											<td>$1200.00</td>
										</tr>
										<tr>
											<th>Costo Total Real</th>
											<td>$2000.20</td>
										</tr>
									</tbody>
								</Table>
							</Col>
							<Col lg={9}>
								<Table
								hover
								responsive
								size="sm"
								>
									<thead>
										<tr>
											<th>Caseta</th>
											<th>Costo Global Maps (esperado)</th>
											<th>Costo Televía (real)</th>
											<th>Fecha de cruce</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Caseta 1</td>
											<td>$120.00</td>
											<td>$200.20</td>
											<td>10 ago 2024</td>
										</tr>
										<tr>
											<td>Caseta 1</td>
											<td>$120.00</td>
											<td>$200.20</td>
											<td>10 ago 2024</td>
										</tr>
										<tr>
											<td>Caseta 1</td>
											<td>$120.00</td>
											<td>x</td>
											<td></td>
										</tr>
										<tr>
											<td>Caseta 1</td>
											<td>$120.00</td>
											<td>$200.20</td>
											<td>10 ago 2024</td>
										</tr>
										<tr>
											<td>Caseta 1</td>
											<td>$120.00</td>
											<td>$200.20</td>
											<td>10 ago 2024</td>
										</tr>
										<tr>
											<td>Caseta 1</td>
											<td>-</td>
											<td>$200.20</td>
											<td>10 ago 2024</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Col>
		</Row>

		<Row>
			<Col>
				<Card>
					<CardBody>
						<Row>
							<Col lg={6}>
								<FormGroup>
									<Input type="text" name="search" id="search" placeholder="Buscar ordenes por tag" />
								</FormGroup>
							</Col>
							<Col lg={3}>
								<FormGroup>
									<Input type="date" name="start_date" id="start_date" placeholder="Fecha de inicio" />
								</FormGroup>
							</Col>
							<Col lg={3}>
								<FormGroup>
									<Input type="date" name="end_date" id="end_date" placeholder="Fecha de fin" />
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
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
										</tr>
										<tr>
											<td>2346426</td>
											<td>10 Ago 2023</td>
											<td>21 Ago 2023</td>
											<td>22 Ago 2023</td>
											<td>Irapuato</td>
											<td>Monterrey</td>
											<td>5</td>
											<td>$1,200.00</td>
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

export default App;
