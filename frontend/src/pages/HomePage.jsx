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
import { getCruces, getCrucesByUnidad } from '../client/cruces';
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
                    costo: value.total_cost
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
                    costo: value.total_cost
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
            console.log(numberOfWeek);
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
            const averageCost = parseInt(data.reduce((acc, value) => acc + value.total_cost, 0) / data.length);
            const averageCruces = parseInt(data.reduce((acc, value) => acc + value.cruces.length, 0) / data.length);
            const averageRow = {
                tag: 'average',
                unidad: 'Promedio',
                cruces: new Array(averageCruces),
                total_cost: averageCost
            };
            // insert average row and sort by total_cost
            data.push(averageRow);
            const sortedData = data.sort((a, b) => b.total_cost - a.total_cost);
            setUnits(sortedData);
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
                        <CardHeader>
                            <h4 className='d-inline px-2'>Gastos por unidad</h4>
                            <p className='d-inline'>({selectedPeriod})</p>
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
                                            <td className={unit.tag==='average'? 'promedio':''}>$ {unit.total_cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card className='costs-per-order-card'>
                        <CardHeader>
                            <h4 className='d-inline px-2'>Gastos por orden</h4>
                            <p className='d-inline'>({selectedPeriod})</p>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Orden</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2842</td>
                                        <td>$ 3,000.00</td>
                                    </tr>
                                    <tr>
                                        <td>3893</td>
                                        <td>$ 2,000.00</td>
                                    </tr>
                                    <tr>
                                        <td>1829</td>
                                        <td>$ 1,000.00</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card className='costs-per-route-card'>
                        <CardHeader>
                            <h4 className='d-inline px-2'>Gastos por cruce</h4>
                            <p className='d-inline'>({selectedPeriod})</p>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Cruce</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Chichimequillas</td>
                                        <td>$ 3,000.00</td>
                                    </tr>
                                    <tr>
                                        <td>Edo. Mex</td>
                                        <td>$ 2,000.00</td>
                                    </tr>
                                    <tr>
                                        <td>Querétaro</td>
                                        <td>$ 1,000.00</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
