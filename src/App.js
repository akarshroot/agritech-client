import React, {Suspense, lazy} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { UserProvider } from './context/UserContext';
// import Home from './pages/public/Home'
// import Login from './pages/public/Login';
// import Signup from './pages/public/Signup';
import PublicBody from './layout/PublicBody';
import PrivateBody from './layout/PrivateBody';
// import Dashboard from './pages/user/Dashboard';
import Wallet from './pages/user/Wallet';
// import Management from './pages/user/management/Management';
// import Campaigns from './pages/user/Campaigns';
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
import { ManagementContextProvider } from './context/ManagementContext';
// import AdminConsole from './pages/user/AdminConsole';
import Forbidden from './pages/public/Forbidden';
import Loader from './assets/loader/Loader'
// import AgriNeeds from './pages/user/agristore/AgriNeeds';
// import FarmFresh from './pages/user/agristore/FarmFresh';
import Whitepaper from './pages/public/Whitepaper';
import UserProfile from './pages/user/Profile'
import Roadblock from './pages/user/Roadblock';

const LoginPage = lazy(()=> import('./pages/public/Login'))
const SignupPage = lazy(()=> import('./pages/public/Signup'))
const HomePage = lazy(() => import('./pages/public/Home'))



const Dashboard = lazy(() => import('./pages/user/Dashboard'))
const Campaigns = lazy(() => import('./pages/user/Campaigns'))
const AgriNeeds = lazy(() => import('./pages/user/agristore/AgriNeeds'))
const Management = lazy(() => import('./pages/user/management/Management'))
const FarmFresh = lazy(() => import('./pages/user/agristore/FarmFresh'))

const AdminConsole = lazy(() => import('./pages/user/AdminConsole'))

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className='LoaderDiv'><Loader height='300px' width='300px' /></div>}>
      <Router>
        <UserProvider>
          <CampaignContextProvider>
            <StoreContextProvider>
              <ManagementContextProvider>
                <Routes>
                  <Route exact path='/login' element={<PublicBody body={LoginPage} />} />
                  <Route exact path='/signup' element={<PublicBody body={SignupPage} />} />
                  <Route exact path='/' element={<PublicBody body={HomePage} />} />
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
                  <Route exact path='/agrineeds' element={<PrivateBody body={AgriNeeds} />} />
                  <Route exact path='/farmfresh' element={<PrivateBody body={FarmFresh} />} />

                  <Route exact path='/agristore/product/:id' element={<PrivateBody body={ProductDetails} />} />
                  <Route exact path='/campaign/details/:id' element={<PrivateBody body={CampaignDetails} />} />

                  <Route exact path='/admin/panel' element={<PrivateBody body={AdminConsole} restricted={true} />} />

                  <Route exact path='/docs/whitepaper' element={<PublicBody body={Whitepaper}/>} />
                  <Route exact path='/forbidden' element={<PublicBody body={Forbidden}/>} />
                  
                  <Route exact path='/loader' element={<Loader height='50px' width='50px' />} />
                  <Route exact path = '/profile' element = {<PrivateBody body = {UserProfile} />} />
                  <Route exact path = '/road' element = {<PrivateBody body = {Roadblock} />} />
                </Routes>
              </ManagementContextProvider>
            </StoreContextProvider>
          </CampaignContextProvider>
        </UserProvider>
      </Router>
      </Suspense>
    </div>
  );
}

export default App;