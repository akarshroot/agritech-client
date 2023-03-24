import React from 'react'
import { Link } from 'react-router-dom'
import './FloatingMenu.css'
import PlanningIco from '../assets/icons/procurement.png'
import ProduceIco from '../assets/icons/produce.png'
import InventoryIco from '../assets/icons/grain.png'
import SalesIco from '../assets/icons/sales.png'

function FloatingMenu(props) {
    return (
        <div className={`floating-menu-container theme-${props.theme}`}>
            <ul>
                <li><Link className='link' to="/management/planning"><img src={PlanningIco} alt="Planning" />Planning</Link></li>
                <li><Link className='link' to="/management/pipeline"><img src={ProduceIco} alt="Produce Pipeline" />Produce Pipeline</Link></li>
                <li><Link className='link' to="/management/inventory"><img src={InventoryIco} alt="Inventory" />Inventory</Link></li>
                <li><Link className='link' to="/management/sales"><img src={SalesIco} alt="Sales" />Sales</Link></li>
            </ul>
        </div>
    )
}

export default FloatingMenu