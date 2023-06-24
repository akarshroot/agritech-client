import React from 'react'
import './AgriStore.css'
import { Link } from 'react-router-dom'
import farmFresh from '../../../assets/images/farmFresh.webp'
import agrineeds from '../../../assets/images/agrineeds.webp'

function AgriStore() {

  return (
    <div className='row m-3 justify-content-center'>
      <div className="card store-cards shadow col-sm-12 col-md-4 col-lg-3 m-5">
          <Link to='/farmfresh' className='agri-link'>
              <img loading='lazy' src={farmFresh} className="card-img-top w-100" alt="..." />
              <div className="card-body">
                <h5 className="card-title">FarmFresh</h5>
                <p className="card-text">Buy Fresh Products from the Farms</p>
              </div>
          </Link>
      </div>
      <div className="card store-cards shadow col-sm-12 col-md-4 col-lg-3 m-5">
        <Link to='/agrineeds' className='agri-link'>
          <img loading='lazy' src={agrineeds} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">AgriNeeds</h5>
            <p className="card-text">Exclusive Supplements for the Farmers</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AgriStore