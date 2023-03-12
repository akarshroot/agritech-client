import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './pages/public/Home'
import { UserProvider } from './context/UserContext';
import Navbar from './layout/PubNavbar';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import PublicBody from './layout/PublicBody';
import PrivateBody from './layout/PrivateBody';
import Dashboard from './pages/user/Dashboard';
import Wallet from './pages/user/Wallet';
import Management from './pages/user/Management';
import Campaigns from './pages/user/Campaigns';
import AgriStore from './pages/user/AgriStore';

function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
            <Routes>
              <Route exact path='/' element={<PublicBody body={Home} />} />
              <Route exact path='/login' element={<PublicBody body={Login} />} />
              <Route exact path='/signup' element={<PublicBody body={Signup} />} />
              <Route exact path='/dashboard' element={<PrivateBody body={Dashboard} />} />
              <Route exact path='/wallet' element={<PrivateBody body={Wallet} />} />
              <Route exact path='/management' element={<PrivateBody body={Management} />} />
              <Route exact path='/campaigns' element={<PrivateBody body={Campaigns} />} />
              <Route exact path='/agristore' element={<PrivateBody body={AgriStore} />} />
            </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
