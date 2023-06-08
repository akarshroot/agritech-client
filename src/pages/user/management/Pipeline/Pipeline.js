import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import './Pipeline.css'

function Pipeline() {
  const navigate = useNavigate()
  const { currentUser, userData, getUserData, theme } = useUser()

  const [percentage, setPercentage] = useState(0)

  const INR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  })

  useEffect(() => {
    if (!userData) getUserData()
    else {
      setPercentage((new Date() - new Date(userData?.currentPlan?.executionStart)) * 100 / (new Date(userData?.currentPlan?.executionEnd) - new Date(userData?.currentPlan?.executionStart)))
    }
  }, [currentUser])

  useEffect(() => {
    if (!userData) getUserData()
  }, [currentUser])

  return (
    <div className={`planning-container theme-${theme}`}>
      <div className="planning-header">
        <Button className="link m-2" style={{ height: "40px" }} onClick={() => navigate("/management")} variant='warning'>&larr; Go back</Button>
        <div className="m-2">
          <h3>PIPELINE</h3>
          <span className="subtext">Below are the crops that are currently sown on your land.</span>
        </div>
        <hr className="style-two" />
      </div>
      <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
        {
          userData?.currentPlan?.requirements.map((item) => {
            if (item.category === 'crop') {
              return (
                <div className="widget crop p-3 d-flex flex-column justify-content-start m-3" key={item._id}>
                  <h4 className='mt-2'>{item.item}</h4>
                  <hr className="style-two" />
                  <span hidden={percentage >= 1}>Just Started!</span>
                  <div className="progress mt-2" style={{ height: "30px" }}>
                    <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                      aria-valuenow={`${(new Date() - new Date(userData?.currentPlan?.executionStart)) * 100 / (new Date(userData?.currentPlan?.executionEnd) - new Date(userData?.currentPlan?.executionStart))}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${(new Date() - new Date(userData?.currentPlan?.executionStart)) * 100 / (new Date(userData?.currentPlan?.executionEnd) - new Date(userData?.currentPlan?.executionStart))}%` }}>
                      <span>{parseInt(percentage)}%</span>
                    </div>
                  </div>
                  <div className='mt-2 alert alert-warning'>Harvest Month: {new Date(userData?.currentPlan?.executionEnd).toLocaleString('default', { month: 'long' })}</div>
                  <div className="current-campaign-widget-details mt-2">
                    <div className="contributions">
                      <span className="quantity"><b>{INR.format(item.estCost)}</b></span><br />
                      <span className="subtext">Cost Price</span>
                    </div>
                    <div className="time-remaining">
                      <span className="quantity"><b>{INR.format(item.estSale)}</b></span><br />
                      <span className="subtext">Sale Value</span>
                    </div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    </div>
  )
}

export default Pipeline