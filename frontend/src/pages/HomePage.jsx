import { useState, useEffect } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Col, 
    Container, 
    Input, 
    Label, 
    Row,
    Table,
} from 'reactstrap';
import { 
    getCruces, 
    getCrucesByUnidad, 
    getCrucesByOrden,
    getCrucesByCaseta 
} from '../client/cruces';
import { CSVLink } from "react-csv";
import { IoDownload } from "react-icons/io5";
import StackedBarChart from '../components/widgets/StackedBarChart';
import '../styles/homepage.scss';

const monthsMapping = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "Abril",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre"
};


export default function HomePage(props) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [crucesByMonth, setCrucesByMonth] = useState([]);
    const [crucesByWeek, setCrucesByWeek] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState();
    const [units, setUnits] = useState([]);
    const [orders, setOrders] = useState([]);
    const [casetas, setCasetas] = useState([]);

    useEffect(() => {
        if (!selectedYear) return;

        // Get cruces by month
        const startOfYear = new Date(selectedYear, 0, 1);
        const endOfYear = new Date(selectedYear, 11, 31);   
        const paramsByMonth = {
            start_dt: startOfYear.toISOString(),
            end_dt: endOfYear.toISOString(),
            group_by: 'month'
        };
        getCruces(paramsByMonth).then((data) => {
            const crucesByMonth = data.map(value => {
                return {
                    mes: monthsMapping[value.month],
                    costo: value.costo_total
                };
            });
            setCrucesByMonth(crucesByMonth);
        });

        // Get cruces by week
        const paramsByWeek = {
            start_dt: startOfYear.toISOString(),
            end_dt: endOfYear.toISOString(),
            group_by: 'week'
        };
        getCruces(paramsByWeek).then((data) => {
            const crucesByWeek = data.map(value => {
                return {
                    semana: value.week,
                    costo: value.costo_total
                };
            });
            setCrucesByWeek(crucesByWeek);
        });
    }, [selectedYear]);

    useEffect(() => {
        if (!selectedPeriod) return;
        let start;
        let end;
        try {
            let numberOfWeek = parseInt(selectedPeriod);
            if (isNaN(numberOfWeek)) throw new Error('Invalid week number');
            const date = new Date(selectedYear, 0, 1);
            const day = date.getDay();
            start = new Date(date.setDate(date.getDate() + (numberOfWeek - 1) * 7 - day));
            end = new Date(date.setDate(date.getDate() + 7));
        } catch (error) {
            let month = Object.entries(monthsMapping).find(([key, value]) => value === selectedPeriod)
            month = parseInt(month[0]) - 1;
            start = new Date(selectedYear, month, 1);
            end = new Date(selectedYear, month + 1, 1);
        }

        getCrucesByUnidad({ 'start_dt': start.toISOString(), 'end_dt': end.toISOString() })
        .then((data) => {
            const averageCost = parseInt(data.reduce((acc, value) => acc + value.costo_total, 0) / data.length);
            const averageCruces = parseInt(data.reduce((acc, value) => acc + value.cruces.length, 0) / data.length);
            const averageRow = {
                tag: 'average',
                unidad: 'Promedio',
                cruces: new Array(averageCruces),
                costo_total: averageCost
            };
            data.push(averageRow);
            const sortedData = data.sort((a, b) => b.costo_total - a.costo_total);
            setUnits(sortedData);
        });

        getCrucesByOrden({ 'start_dt': start.toISOString(), 'end_dt': end.toISOString() })
        .then((data) => {
            const averageCost = parseInt(data.reduce((acc, value) => acc + value.costo_total, 0) / data.length);
            const averageCruces = parseInt(data.reduce((acc, value) => acc + value.cruces.length, 0) / data.length);
            const averageRow = {
                numero: 'Promedio',
                costo_total: averageCost,
                cruces: new Array(averageCruces),
            };
            data.push(averageRow);
            const sortedData = data.sort((a, b) => b.costo_total - a.costo_total);
            setOrders(sortedData);
        });

        getCrucesByCaseta({ 'start_dt': start.toISOString(), 'end_dt': end.toISOString() })
        .then((data) => {
            const averageCost = parseInt(data.reduce((acc, value) => acc + value.costo_total, 0) / data.length);
            const averageCruces = parseInt(data.reduce((acc, value) => acc + value.cruces.length, 0) / data.length);
            const averageRow = {
                nombre: 'Promedio',
                costo_total: averageCost,
                cruces: new Array(averageCruces),
            };
            data.push(averageRow);
            const sortedData = data.sort((a, b) => b.costo_total - a.costo_total);
            setCasetas(sortedData);
        });

    }, [selectedPeriod]);

    return (
        <Container className='home-page'>
            <Row className='mb-3'>
                <Col md={4} className='d-flex align-items-center'>
                    <h3 className='m-0'>Gasto de casetas por periodo</h3>
                </Col>
                <Col md={2}>
                    <div className='d-flex align-items-center'>
                        <Label for="year" className="text-align-center m-0 p-3">Año</Label>
                        <Input 
                        type="select" 
                        name="year" 
                        id="year" 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(e.target.value)}>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </Input>
                    </div>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Card className='costs-per-month-card'>
                        <CardBody>
                            <StackedBarChart 
                                data={crucesByMonth}
                                keys={['costo']}
                                indexBy='mes'
                                xLabel='Mes'
                                yLabel='Costo'
                                yAxisEnabled={false}
                                onClick={e => setSelectedPeriod(e.data.mes)}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className='costs-per-week-card'>
                        <CardBody>
                            <StackedBarChart 
                                data={crucesByWeek}
                                keys={['costo']}
                                indexBy='semana'
                                xLabel='Semana'
                                yLabel='Costo'
                                yAxisEnabled={false}
                                labelsEnabled={false}
                                onClick={e => setSelectedPeriod(e.data.semana)}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className='costs-per-unit-card'>
                        <CardHeader className='d-flex justify-content-between align-items-center'>
                            <span>
                                <h4 className='d-inline px-2'>Gastos por unidad</h4>
                                <p className='d-inline'>({selectedPeriod})</p>
                            </span>
                            <CSVLink
                            data={units.map(unit => ({ ...unit, cruces: unit.cruces.length }))}
                            headers={[
                                { label: "Unidad", key: "unidad" },
                                { label: "Tag", key: "tag" },
                                { label: "Cruces", key: "cruces" },
                                { label: "Costo total", key: "costo_total" }
                            ]}
                            filename={`económicos.csv`}
                            className="btn btn-primary">
                                <span className="d-flex align-items-center">
                                    <IoDownload style={{ marginRight: '0.2rem' }} />
                                    <span className="pl-2">Descargar</span>
                                </span>
                            </CSVLink>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Cruces</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map(unit => (
                                        <tr key={unit.tag}>
                                            <td className={unit.tag==='average'? 'promedio':''}>{unit.unidad}</td>
                                            <td className={unit.tag==='average'? 'promedio':''}>{unit.cruces.length || 0}</td>
                                            <td className={unit.tag==='average'? 'promedio':''}>$ {unit.costo_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>

                <Col>
                    <Card className='costs-per-order-card'>
                        <CardHeader className='d-flex justify-content-between align-items-center'>
                            <span>
                                <h4 className='d-inline px-2'>Gastos por orden</h4>
                                <p className='d-inline'>({selectedPeriod})</p>
                            </span>
                            <CSVLink
                            data={orders.map(unit => ({ ...unit, cruces: unit.cruces.length }))}
                            headers={[
                                { label: "Orden", key: "numero" },
                                { label: "Cruces", key: "cruces" },
                                { label: "Costo total", key: "costo_total" }
                            ]}
                            filename={`ordenes.csv`}
                            className="btn btn-primary">
                                <span className="d-flex align-items-center">
                                    <IoDownload style={{ marginRight: '0.2rem' }} />
                                    <span className="pl-2">Descargar</span>
                                </span>
                            </CSVLink>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Orden</th>
                                        <th>Cruces</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr key={i}>
                                            <td className={order.numero==='Promedio'? 'promedio':''}>{order.numero}</td>
                                            <td className={order.numero==='Promedio'? 'promedio':''}>{order.cruces.length || 0}</td>
                                            <td className={order.numero==='Promedio'? 'promedio':''}>$ {order.costo_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>

                <Col>
                    <Card className='costs-per-route-card'>
                        <CardHeader className='d-flex justify-content-between align-items-center'>
                            <span>
                                <h4 className='d-inline px-2'>Gastos por caseta</h4>
                                <p className='d-inline'>({selectedPeriod})</p>
                            </span>
                            <CSVLink
                            data={casetas.map(unit => ({ ...unit, cruces: unit.cruces.length }))}
                            headers={[
                                { label: "Caseta", key: "nombre" },
                                { label: "Cruces", key: "cruces" },
                                { label: "Costo total", key: "costo_total" }
                            ]}
                            filename={`casetas.csv`}
                            className="btn btn-primary">
                                <span className="d-flex align-items-center">
                                    <IoDownload style={{ marginRight: '0.2rem' }} />
                                    <span className="pl-2">Descargar</span>
                                </span>
                            </CSVLink>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Caseta</th>
                                        <th>Cruces</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {casetas.map((caseta, i) => (
                                        <tr key={i}>
                                            <td className={caseta.nombre==='Promedio'? 'promedio':''}>{caseta.nombre}</td>
                                            <td className={caseta.nombre==='Promedio'? 'promedio':''}>{caseta.cruces.length || 0}</td>
                                            <td className={caseta.nombre==='Promedio'? 'promedio':''}>$ {caseta.costo_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
