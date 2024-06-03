import { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Input, Row, Table, Form } from "reactstrap";
import Swal from 'sweetalert2'
import { getCasetas, updateCaseta, deleteCaseta } from "../client/casetas";
import '../styles/casetaspage.scss'

export default function CasetasPage(props) {
    const [casetas, setCasetas] = useState();
    const [editingCaseta, setEditingCaseta] = useState(null);

    useEffect(() => {
        getCasetas()
            .then((data) => {
                setCasetas(data);
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

        updateCaseta(editingCaseta, data)
            .then(() => {
                Swal.fire({
                    title: '¡Caseta actualizada!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                setEditingCaseta(null);
                getCasetas()
                    .then((data) => {
                        setCasetas(data);
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
            title: '¿Estás seguro de que deseas eliminar la caseta?',
            text: "Toda la información relacionada con esta caseta también será eliminada. ¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });
        if (!isConfirmed) return;
        
        deleteCaseta(casetaId)
            .then(() => {
                getCasetas()
                    .then((data) => {
                        setCasetas(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
        setEditingCaseta(null);
    };

    return (
        <Container className="casetas-page">
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row className="mb-4">
                                <Col>
                                    <h4>Casetas registradas</h4>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form onSubmit={updateCasetaOnSubmit}>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Clave</th>
                                                    <th>Estado</th>
                                                    <th>Costo esperado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                                {casetas &&
                                                    casetas.map((caseta) => (
                                                            <tr key={caseta.id}>
                                                                {editingCaseta === caseta.id ? (
                                                                    <>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="nombre"
                                                                                defaultValue={caseta.nombre}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="lugar"
                                                                                defaultValue={caseta.lugar.nombre_id}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="text"
                                                                                name="estado"
                                                                                defaultValue={caseta.lugar.estado}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                type="number"
                                                                                name="costo"
                                                                                defaultValue={caseta.costo}
                                                                            />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td>{caseta.nombre}</td>
                                                                        <td>{caseta.lugar.nombre_id}</td>
                                                                        <td>{caseta.lugar.estado}</td>
                                                                        <td>$ {caseta.costo}.00</td>
                                                                    </>
                                                                )}
                                                                <td>
                                                                    {editingCaseta === caseta.id ? (
                                                                        <>
                                                                            <Input className="submit-input" type="submit" value="Guardar" />
                                                                            <Button className="cancel-btn" onClick={() => setEditingCaseta(null)}>Cancelar</Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Button className="edit-btn" onClick={() => setEditingCaseta(caseta.id)}>
                                                                                Editar
                                                                            </Button>
                                                                            <Button className="delete-btn" onClick={() => deleteCasetaOnClick(caseta.id)}>
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
