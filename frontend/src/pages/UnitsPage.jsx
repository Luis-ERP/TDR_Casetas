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
import { IoDownload } from "react-icons/io5";
import { CSVLink } from "react-csv";
import { useSearchParams } from "react-router-dom";
import { getCrucesByUnidad } from "../client/cruces";
import { getOrders } from "../client/orders";


export default function UnitsPage(props) {
    const [units, setUnits] = useState([]);
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [week, setWeek] = useState();
    const [selectedUnit, setSelectedUnit] = useState();
    const [orders, setOrders] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const getUnitsData = (endOfMonth, startOfMonth) => {
        getCrucesByUnidad({ 'start_dt': startOfMonth.toISOString(), 'end_dt': endOfMonth.toISOString() })
        .then((data) => {
            if (data.length === 0) return;
            setUnits(data);
        });
    };

    const getOrdersData = (unitNumber) => {
        if (selectedUnit) {
            const params = {'unidad__numero': selectedUnit};
            if (month && year) {
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0);
                params.fecha_inicio__gte = startOfMonth.toISOString();
                params.fecha_inicio__lt = endOfMonth.toISOString();
            }
            getOrders(params).then((data) => {
                console.log(data);
                data = data.sort((x, y) => new Date(x.fecha_inicio) <= new Date(y.fecha_inicio) ? 1 : -1)
                       .map(x => ({ ...x, fecha_inicio: new Date(x.fecha_inicio).toLocaleString() }))
                       .map(x => ({ ...x, fecha_fin: new Date(x.fecha_fin).toLocaleString() }));
                setOrders(data);
            });
        }
    };

    const changeFilters = (key, value) => {
        const currentParams = Object.fromEntries(searchParams);
        currentParams[key] = value;
        if (value === '')
            delete currentParams[key];
        setSearchParams({ ...currentParams});
    };

    useEffect(() => {
        const params = Object.fromEntries(searchParams);
        if (!params.mes)
            changeFilters('mes', new Date().getMonth()+1);
        if (!params.año)
            changeFilters('año', new Date().getFullYear());
    }, []);

    useEffect(() => {
        const { mes, año, semana } = Object.fromEntries(searchParams);
        setMonth(mes || null);
        setYear(año || null);
        setWeek(semana || null);
        let endOfMonth;
        let startOfMonth;
        if (!mes && !año && !semana) {
            endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        } else if (mes && año) {
            endOfMonth = new Date(año, mes, 0);
            startOfMonth = new Date(año, mes - 1, 1);
        } else if (mes) {
            endOfMonth = new Date(new Date().getFullYear(), mes, 0);
            startOfMonth = new Date(new Date().getFullYear(), mes - 1, 1);
        }
        else if (año) {
            endOfMonth = new Date(año, 12, 0);
            startOfMonth = new Date(año, 0, 1);
        } else if (semana) {
            // Calculate start and end of week
            const today = new Date();
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            const firstDayOfWeek = new Date(today.getFullYear(), 0, 1 + (weekNumber - 1) * 7);
            const lastDayOfWeek = new Date(today.getFullYear(), 0, 1 + (weekNumber - 1) * 7 + 6);
            startOfMonth = firstDayOfWeek;
            endOfMonth = lastDayOfWeek;
        }
        getUnitsData(endOfMonth, startOfMonth);
    }, [searchParams]);

    return (
        <Container className='units-page'>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row className='mb-4 d-flex justify-content-between'>
                                <Col>
                                    <h4>Económicos</h4>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <CSVLink
                                    data={units.map(unit => ({ ...unit, cruces: unit.cruces.length }))}
                                    headers={[
                                        { label: "Unidad", key: "unidad" },
                                        { label: "Tag", key: "tag" },
                                        { label: "Cruces", key: "cruces" },
                                        { label: "Costo total", key: "costo_total" }
                                    ]}
                                    filename={`económicos-${month}/${year}.csv`}
                                    className="btn btn-primary">
                                        <span className="d-flex align-items-center">
                                            <IoDownload />
                                            <span style={{ padingLeft: '0.2rem' }}>
                                                Descargar CSV
                                            </span>
                                        </span>
                                    </CSVLink>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6} lg={2}>
                                    <FormGroup>
                                        <Input 
                                        type="select" 
                                        name="mes" 
                                        id="mes" 
                                        onChange={(e) => changeFilters('mes', e.target.value)}
                                        value={month || ''}>
                                            <option value="">Mes</option>
                                            <option value={1}>Enero</option>
                                            <option value={2}>Febrero</option>
                                            <option value={3}>Marzo</option>
                                            <option value={4}>Abril</option>
                                            <option value={5}>Mayo</option>
                                            <option value={6}>Junio</option>
                                            <option value={7}>Julio</option>
                                            <option value={8}>Agosto</option>
                                            <option value={9}>Septiembre</option>
                                            <option value={10}>Octubre</option>
                                            <option value={11}>Noviembre</option>
                                            <option value={12}>Diciembre</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6} lg={2}>
                                    <FormGroup>
                                        <Input 
                                        type="select" 
                                        name="año" 
                                        id="año" 
                                        onChange={(e) => changeFilters('año', e.target.value)}
                                        value={year || ''}>
                                            <option value="">Año</option>
                                            <option value={2023}>2023</option>
                                            <option value={2024}>2024</option>
                                            <option value={2025}>2025</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                {/* <Col lg={2}>
                                    <FormGroup>
                                        <Input 
                                        type="select" 
                                        name="año" 
                                        id="año" 
                                        onChange={(e) => changeFilters('semana', e.target.value)}
                                        value={week || ''}>
                                            <option value="">Semana</option>
                                            {[...Array(52).keys()].map((i) => {
                                                return <option key={i} value={i+1}>{i+1}</option>
                                            })}
                                        </Input>
                                    </FormGroup>
                                </Col> */}
                            </Row>

                            <Row>
                                <Col md={12} lg={6}>
                                    <Table
                                    hover
                                    responsive
                                    size="sm"
                                    >
                                        <thead>
                                            <tr>
                                                <th>Unidad</th>
                                                <th>Tag</th>
                                                <th>Cruces</th>
                                                <th>Costo total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {units.map((unit) => (
                                                <tr 
                                                key={unit.unidad} 
                                                onClick={() => setSelectedUnit(unit.unidad)}
                                                className="cursor-pointer">
                                                    <td>{unit.unidad}</td>
                                                    <td>{unit.tag}</td>
                                                    <td>{unit.cruces.length}</td>
                                                    <td>$ {unit.costo_total}</td>
                                                </tr>
                                            ))}                                            
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col md={12} lg={6}>
                                    <p>Gráfica de estadística descriptiva</p>
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
                            <Row className='mb-4 justify-content-between d-flex'>
                                <Col>
                                    <h4>
                                        Buscar órdenes
                                    </h4>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <CSVLink
                                    data={orders.map(o => ({ 
                                        ...o, 
                                        lugar_origen: o.lugar_origen.nombre,
                                        lugar_destino: o.lugar_destino.nombre,
                                     }))}
                                    headers={[
                                        { label: "Orden", key: "numero" },
                                        { label: "Fecha inicio", key: "fecha_inicio" },
                                        { label: "Fecha fin", key: "fecha_fin" },
                                        { label: "Origen", key: "lugar_origen" },
                                        { label: "Destino", key: "lugar_destino" },
                                        { label: "Costo esperado", key: "costo_esperado" },
                                        { label: "Costo total", key: "costo_total" }
                                    ]}
                                    filename={`ordenes ${selectedUnit} ${month} ${year}.csv`}
                                    className="btn btn-primary">
                                        <span className="d-flex align-items-center">
                                            <IoDownload />
                                            <span style={{ padingLeft: '0.2rem' }}>
                                                Descargar CSV
                                            </span>
                                        </span>
                                    </CSVLink>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2} lg={1}>
                                    <Button 
                                    color="primary" 
                                    onClick={getOrdersData}>
                                        Buscar
                                    </Button>
                                </Col>
                                <Col md={4} lg={5}>
                                    <FormGroup>
                                        <Input 
                                        type="text" 
                                        name="search" 
                                        id="search"
                                        value={selectedUnit || ''}
                                        onChange={(e) => setSelectedUnit(e.target.value)} 
                                        placeholder="Buscar ordenes de la unidad" />
                                    </FormGroup>
                                </Col>
                                <Col md={3} lg={3}>
                                    <FormGroup>
                                        <Input 
                                            type="select" 
                                            name="mes" 
                                            id="mes" 
                                            onChange={(e) => changeFilters('mes', e.target.value)}
                                            value={month || ''}>
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
                                <Col md={3} lg={3}>
                                    <FormGroup>
                                        <Input 
                                        type="select" 
                                        name="año" 
                                        id="año" 
                                        onChange={(e) => changeFilters('año', e.target.value)}
                                        value={year || ''}>
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
                                                <th>Inicio del viaje</th>
                                                <th>Fin del viaje</th>
                                                <th>Origen</th>
                                                <th>Destino</th>
                                                <th>Esperado</th>
                                                <th>Costo real</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, i) => {
                                                return (
                                                    <tr key={i} className="cursor-pointer">
                                                        <td>{order.numero}</td>
                                                        <td>{order.fecha_inicio}</td>
                                                        <td>{order.fecha_fin}</td>
                                                        <td>{order.lugar_origen.nombre}</td>
                                                        <td>{order.lugar_destino.nombre}</td>
                                                        <td>$ {order.costo_esperado}.00</td>
                                                        <td>$ {order.costo_total}.00</td>
                                                    </tr>
                                                );
                                            })}
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