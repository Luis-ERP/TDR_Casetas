import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import UnitsPage from './pages/UnitsPage';
import CasetasPage from './pages/CasetasPage';
import LoginPage from './pages/LoginPage';
import useSession from './hooks/useSession';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
	const [page, setPage] = useState('inicio');
	const { token } = useSession();

	// if (!token) {
	// 	return <LoginPage />;
	// }

	return (
		<div className="App d-flex">
			<BrowserRouter>
				<Routes>
					<Route
					path=""
					element={
						<div className='App-content'>
							<Sidebar activeLink={page} setActiveLink={setPage} />
							<div className='content'>
								<Navbar />
								{page === 'inicio'    ? <HomePage changeLink={setPage} />
								: page === 'unidades' ? <UnitsPage changeLink={setPage} />
								: page === 'ordenes'  ? <OrdersPage changeLink={setPage} />
								: page === 'casetas'  ? <CasetasPage changeLink={setPage} />
								: <></>
								}
							</div>
						</div>
					}/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
