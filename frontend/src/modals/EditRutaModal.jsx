import { useState, useEffect } from "react";
import { 
    Form, 
    FormGroup, 
    Modal, 
    ModalBody, 
    Button,
    Input,
    Label,
    Row,
    Col
} from "reactstrap";
import { getRuta } from "../client/rutas";
import { getCasetas } from "../client/casetas";

export default function EditRutaModal(props) {
    const [ruta, setRuta] = useState(null);
    const [casetas, setCasetas] = useState([]);
    const [selectedCasetas, setSelectedCasetas] = useState([]);

    useEffect(() => {
        getCasetas()
            .then((data) => {
                setCasetas(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        getRuta(props.rutaId)
            .then((data) => {
                const selectedCasetas = [];
                data.casetas.forEach((caseta) => {
                    selectedCasetas.push(caseta);
                });
                setSelectedCasetas(selectedCasetas);
                setRuta(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.rutaId]);

    const onCasetasSelect = (caseta) => {
        setSelectedCasetas([...selectedCasetas, caseta]);
        setCasetas(casetas.filter((c) => c.id !== caseta.id));
    }

    const onCasetaDeselect = (caseta) => {
        setCasetas([...casetas, caseta]);
        setSelectedCasetas(selectedCasetas.filter((c) => c.id !== caseta.id));
    }
    
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle} size="xl">
            <ModalBody>
                <h4>Editar ruta</h4>
                <hr />

                {ruta === null 
                ? <p>Cargando...</p>
                : (
                    <Form>
                        <Button className="btn btn-primary" style={{ margin: '0 0 1rem 0' }}>
                            Guardar
                        </Button>

                        <FormGroup className="form-group">
                            <Label for="nombre">Nombre</Label>
                            <Input
                                type="text"
                                name="nombre"
                                defaultValue={ruta.nombre}
                            />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <Label for="lugar">Origen</Label>
                            <Input
                                type="text"
                                name="lugar"
                                defaultValue={ruta.lugar_origen.nombre}
                            />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <Label for="lugar">Destino</Label>
                            <Input
                                type="text"
                                name="lugar"
                                defaultValue={ruta.lugar_destino.nombre}
                            />
                        </FormGroup>

                        <Row>
                            <Col md={6}>
                                <h5>Casetas</h5>
                            </Col>
                            <Col md={6}>
                                <h5>Seleccionadas</h5>
                            </Col>
                        </Row>

                        <Row className="d-flex">
                            <Col md={6} className="y-scroll">
                                {casetas.map((caseta) => (
                                    <Button 
                                    key={caseta.id} 
                                    className="d-flex align-items-center justify-content-between" 
                                    style={{ width: '100%' }}
                                    onClick={() => onCasetasSelect(caseta)}>
                                        <span className="m-0">+ {caseta.nombre} </span>
                                        <span className="m-0">$ {caseta.costo}.00</span>
                                    </Button>
                                ))}
                            </Col>

                            <Col md={6} className="y-scroll">
                                {selectedCasetas.map((caseta) => (
                                    <Button 
                                    key={caseta.id} 
                                    className="d-flex align-items-center justify-content-between" 
                                    style={{ width: '100%', fontWeight: 'normal !important' }}
                                    onClick={() => onCasetaDeselect(caseta)}>
                                        <span className="m-0">- {caseta.nombre} </span>
                                        <span className="m-0">$ {caseta.costo}.00</span>
                                    </Button>
                                ))}
                            </Col>
                        </Row>
                    </Form>
                )}
            </ModalBody>
        </Modal>
    )
}