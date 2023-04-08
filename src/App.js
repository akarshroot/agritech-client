import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './pages/public/Home'
import { UserProvider } from './context/UserContext';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import PublicBody from './layout/PublicBody';
import PrivateBody from './layout/PrivateBody';
import Dashboard from './pages/user/Dashboard';
import Wallet from './pages/user/Wallet';
import Management from './pages/user/management/Management';
import Campaigns from './pages/user/Campaigns';
import ExploreCampaigns from './pages/user/ExploreCampaigns';
import AgriStore from './pages/user/agristore/AgriStore';
import Planning from './pages/user/management/Planning/Planning';
import Pipeline from './pages/user/management/Pipeline/Pipeline';
import Inventory from './pages/user/management/Inventory/Inventory';
import CampaignDetails from './pages/user/management/CampaignDetails';
import Sales from './pages/user/management/Sales/Sales';
import { CampaignContextProvider } from './context/CampaignContext';
import ProductDetails from './pages/user/agristore/ProductDetails';
import { StoreContextProvider } from './context/StoreContext';

function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <CampaignContextProvider>
            <StoreContextProvider>
              <Routes>
                <Route exact path='/' element={<PublicBody body={Home} />} />
                <Route exact path='/login' element={<PublicBody body={Login} />} />
                <Route exact path='/signup' element={<PublicBody body={Signup} />} />
                <Route exact path='/dashboard' element={<PrivateBody body={Dashboard} />} />

                <Route exact path='/management' element={<PrivateBody body={Management} />} />
                <Route exact path='/management/planning' element={<PrivateBody body={Planning} />} />
                <Route exact path='/management/pipeline' element={<PrivateBody body={Pipeline} />} />
                <Route exact path='/management/inventory' element={<PrivateBody body={Inventory} />} />

                <Route exact path='/management/sales' element={<PrivateBody body={Sales} />} />
                <Route exact path='/wallet' element={<PrivateBody body={Wallet} />} />
                <Route exact path='/campaigns' element={<PrivateBody body={Campaigns} />} />
                <Route exact path='/campaigns/all' element={<PrivateBody body={ExploreCampaigns} />} />
                <Route exact path='/agristore' element={<PrivateBody body={AgriStore} />} />

                <Route exact path='/agristore/product/:id' element={<PrivateBody body={ProductDetails} />} />
                <Route exact path='/detailedCampaign' element={<PrivateBody body={CampaignDetails} />} />
              </Routes>
            </StoreContextProvider>
          </CampaignContextProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
