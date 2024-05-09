import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, FormGroup, Input, Card, CardBody, Button, Form, CardHeader } from 'reactstrap';
import './App.css';

const data = {
	'id': 43,
	'numero': '1336609',
	'costo_total_esperado': 1007.0,
	'unidad': {
		'id': 262,
		'tag': 'OHLM01632770',
		'numero': 1846
	},
	'lugar_origen': {
		'id': 1,
		'name': 'Colgate Iturbide'
	},
	'lugar_destino': {
		'id': 2,
		'name': 'Cedis Colgate Tultitlán'
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
						<Row className='mb-4'>
							<Col>
								<h4>
									Información por orden
								</h4>
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
											<td>{order.lugar_origen.name}</td>
										</tr>
										<tr>
											<th>Destino</th>
											<td>{order.lugar_destino.name}</td>
										</tr>
										<tr>
											<th>Costo Total Esperado</th>
											<td>${order.costo_total_esperado}.00</td>
										</tr>
										<tr>
											<th>Costo Total Real</th>
											<td>$563.00</td>
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
											<td>Chichimequillas 127</td>
											<td>$147.00</td>
											<td>$104.20</td>
											<td>01 ene 2024</td>
										</tr>
										<tr>
											<td>Tepeji Palmillas 20A</td>
											<td>$416.00</td>
											<td>$416.00</td>
											<td>01 ene 2024</td>
										</tr>
										<tr>
											<td>Tepozotlán</td>
											<td>$444.00</td>
											<td>(no transitó)</td>
											<td></td>
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
						<Row className='mb-4'>
							<Col>
								<h4>
									Buscar órdenes por tag
								</h4>
							</Col>
						</Row>
						<Row>
							<Col lg={1}>
								<Button color="primary">Buscar</Button>
							</Col>
							<Col lg={5}>
								<FormGroup>
									<Input type="text" name="search" id="search" placeholder="Buscar ordenes por tag" defaultValue="OHLM01632770" />
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

export default App;
