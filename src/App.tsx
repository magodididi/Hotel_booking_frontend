import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotelList from './components/HotelList';
import RoomPage from './pages/RoomPage';
import SupportPage from './pages/SupportPage';
import 'antd/dist/reset.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelList />} />
                <Route path="/rooms/:hotelId" element={<RoomPage />} />
                <Route path="/support" element={<SupportPage />} />
            </Routes>
        </Router>
    );
};

export default App;
