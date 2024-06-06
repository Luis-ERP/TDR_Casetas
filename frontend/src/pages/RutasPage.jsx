import { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Input, Row, Table, Form } from "reactstrap";
import { CSVLink } from "react-csv";
import { IoDownload } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { getRutas, updateRuta, deleteRuta } from "../client/rutas";
import '../styles/casetaspage.scss';

export default function RutasPage(props) {
    const [rutas, setRutas] = useState();
    const [editingRuta, setEditingRuta] = useState(null);

    useEffect(() => {
        getRutas()
            .then((data) => {
                setRutas(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const updateCasetaOnSubmit = (event) => {
        event.preventDefault();

        const data = {
            nombre: event.target.nombre.value,
            lugar__nombre_id: event.target.lugar.value,
            lugar__estado: event.target.estado.value,
            costo: event.target.costo.value,
        };

        updateRuta(editingRuta, data)
            .then(() => {
                Swal.fire({
                    title: '¡Caseta actualizada!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setEditingRuta(null);
                getRutas()
                    .then((data) => {
                        setRutas(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteCasetaOnClick = async (casetaId) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro de que deseas eliminar la ruta?',
            text: "Toda la información relacionada con esta ruta también será eliminada. ¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });
        if (!isConfirmed) return;
        
        deleteRuta(casetaId)
            .then(() => {
                getRutas()
                    .then((data) => {
                        setRutas(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
        setEditingRuta(null);
    };

    return (
        <Container className="rutas-page">
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row className="mb-4">
                                <Col>
                                    <h4>Casetas registradas</h4>
                                </Col>
                                {rutas &&
                                    <Col className="d-flex justify-content-end">
                                        <CSVLink
                                        data={rutas.map(c => ({ 
                                            ...c, 
                                            lugar_origen: c.lugar_origen.nombre,
                                            lugar_destino: c.lugar_destino.nombre,
                                        }))}
                                        headers={[
                                            { label: "Ruta", key: "nombre" },
                                            { label: "Origen", key: "lugar_origen" },
                                            { label: "Destino", key: "lugar_destino" },
                                        ]}
                                        filename={`rutas.csv`}
                                        className="btn btn-primary">
                                            <span className="d-flex align-items-center">
                                                <IoDownload />
                                                <span style={{ paddingLeft: '0.2rem' }}>
                                                    Descargar CSV
                                                </span>
                                            </span>
                                        </CSVLink>
                                    </Col>
                                }
                            </Row>

                            <Row>
                                <Col>
                                    <Form onSubmit={updateCasetaOnSubmit}>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th>Ruta</th>
                                                    <th>Origen</th>
                                                    <th>Destino</th>
                                                </tr>
                                                {rutas &&
                                                    rutas.map((ruta) => (
                                                            <tr key={ruta.id}>
                                                                {editingRuta === ruta.id ? (
                                                                    <>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="nombre"
                                                                                defaultValue={ruta.nombre}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="lugar"
                                                                                defaultValue={ruta.lugar.nombre_id}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="estado"
                                                                                defaultValue={ruta.lugar.estado}
                                                                            />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td>{ruta.nombre}</td>
                                                                        <td>{ruta.lugar_origen.nombre}</td>
                                                                        <td>{ruta.lugar_destino.nombre}</td>
                                                                    </>
                                                                )}
                                                                <td>
                                                                    {editingRuta === ruta.id ? (
                                                                        <>
                                                                            <Input className="submit-input" type="submit" value="Guardar" />
                                                                            <Button className="cancel-btn" onClick={() => setEditingRuta(null)}>Cancelar</Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Button className="edit-btn" onClick={() => setEditingRuta(ruta.id)}>
                                                                                Editar
                                                                            </Button>
                                                                            <Button className="delete-btn" onClick={() => deleteCasetaOnClick(ruta.id)}>
                                                                                Eliminar
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
