import { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { IoReorderThree, IoGrid, IoBarChart, IoBus, IoDocuments } from "react-icons/io5";
import '../styles/sidebar.scss';

export default function Sidebar({activeLink, setActiveLink}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="sidebar d-flex flex-column" style={{ width: !collapsed ? '250px' : '85px' }}>
            <div className='d-flex pt-3 collapse-btn' onClick={() => setCollapsed(!collapsed)}>
                <IoReorderThree size={25} color='primary' />
            </div>
            <hr />

            <Nav pills vertical justified={false}>
                <NavItem>
                    <NavLink
                    onClick={() => setActiveLink('inicio')} 
                    active={activeLink === 'inicio'} >
                        <IoGrid />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Inicio</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    onClick={() => setActiveLink('unidades')} 
                    active={activeLink === 'unidades'} >
                        <IoBus />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Económicos</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    onClick={() => setActiveLink('ordenes')} 
                    active={activeLink === 'ordenes'} >
                        <IoDocuments />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Órdenes</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    onClick={() => setActiveLink('reportes')} 
                    active={activeLink === 'reportes'} >
                        <IoBarChart />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Reportes</span>
                    </NavLink>
                </NavItem>
            </Nav>
        </div>
    );
}
