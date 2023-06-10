import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FloatingMenu.css'
import PlanningIco from '../assets/icons/procurement.png'
import ProduceIco from '../assets/icons/produce.png'
import InventoryIco from '../assets/icons/grain.png'
import SalesIco from '../assets/icons/sales.png'

function FloatingMenu(props) {
    const navigate = useNavigate()

    return (
        <>
            <div className={`floating-menu-container theme-${props.theme} d-none d-md-block`}>
                <ul>
                    <li onClick={() => navigate("/management/planning")}><img src={PlanningIco} alt="Planning" />Planning</li>
                    <li onClick={() => navigate("/management/pipeline")}><img src={ProduceIco} alt="Produce Pipeline" />Produce Pipeline</li>
                    <li onClick={() => navigate("/management/inventory")}><img src={InventoryIco} alt="Inventory" />Inventory</li>
                    <li onClick={() => navigate("/management/sales")}><img src={SalesIco} alt="Sales" />Sales</li>
                </ul>
            </div>
            <div className={`floating-menu-container theme-${props.theme} d-block fixed-bottom w-100 rounded-0 d-md-none`}>
                <ul>
                    <li className='p-2' onClick={() => navigate("/management/planning")}><img src={PlanningIco} alt="Planning" /></li>
                    <div className="vr"></div>
                    <li className='p-2' onClick={() => navigate("/management/pipeline")}><img src={ProduceIco} alt="Produce Pipeline" /></li>
                    <div className="vr"></div>
                    <li className='p-2' onClick={() => navigate("/management/inventory")}><img src={InventoryIco} alt="Inventory" /></li>
                    <div className="vr"></div>
                    <li className='p-2' onClick={() => navigate("/management/sales")}><img src={SalesIco} alt="Sales" /></li>
                </ul>
            </div>
        </>
    )
}

export default FloatingMenu