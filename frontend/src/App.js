import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import UnitsPage from './pages/UnitsPage';
import LoginPage from './pages/LoginPage';
import useSession from './hooks/useSession';
import './styles/_overrides.scss';
import './App.css';


function App() {
	const [page, setPage] = useState('inicio');
	const { token } = useSession();

	// if (!token) {
	// 	return <LoginPage />;
	// }

	return (
		<div className="App d-flex">
			<div>
				<Sidebar activeLink={page} setActiveLink={setPage} />
			</div>
			<div className='content px-1'>
				<Navbar />
				{page === 'inicio' ? <HomePage changeLink={setPage} />
				: page === 'unidades' ? <UnitsPage changeLink={setPage} />
				: page === 'ordenes' ? <OrdersPage changeLink={setPage} />
				: <></>
				}
			</div>
		</div>
	);
}

export default App;
