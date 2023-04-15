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
          setPercentage((new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart)))
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
      {
        userData?.currentPlan.requirements.map((item) => {
          if (item.category === 'crop') {
            return (
              <div className="crop p-1 d-flex flex-column justify-content-around" key={item._id}>
                <h4>{item.item}</h4>
                <hr className="style-two" />
                <div className="progress" style={{ height: "30px" }}>
                    <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                        aria-valuenow={`${(new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart))}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${(new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart))}%` }}>
                        <span>{percentage}%</span>
                    </div>
                </div>
                <div>Harvest Month: {new Date(userData?.currentPlan.executionEnd).toLocaleString('default', { month: 'long' })}</div>
                <div className="current-campaign-widget-details">
                  <div className="contributions">
                    <span className="quantity"><b>{item.estCost}</b></span><br />
                    <span className="subtext">Cost Price</span>
                  </div>
                  <div className="time-remaining">
                    <span className="quantity"><b>{item.estSale}</b></span><br />
                    <span className="subtext">Sale Value</span>
                  </div>
                </div>
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default Pipeline