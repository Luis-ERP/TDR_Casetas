import { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { IoReorderThree, IoGrid, IoLogOut, IoBus, IoDocuments, IoCar, IoMap } from "react-icons/io5";
import useSession from '../hooks/useSession';
import '../styles/sidebar.scss';

export default function Sidebar({activeLink, setActiveLink}) {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useSession();

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
                    onClick={() => setActiveLink('casetas')} 
                    active={activeLink === 'casetas'} >
                        <IoCar />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Casetas</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    onClick={() => setActiveLink('rutas')} 
                    active={activeLink === 'rutas'} >
                        <IoMap />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Rutas</span>
                    </NavLink>
                </NavItem>
                <NavItem style={{ height: '460px' }} />
                <NavItem>
                    <NavLink onClick={logout}>
                        <IoLogOut />
                        <span style={{ display: !collapsed ? 'inline' : 'none' }}>Cerrar sesión</span>
                    </NavLink>
                </NavItem>
            </Nav>
        </div>
    );
}
