import React, { useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import './Pipeline.css'

function Pipeline() {
  const navigate = useNavigate()
  const { currentUser, userData, getUserData, theme } = useUser()

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
              <div className="crop p-1" key={item._id}>
                <h4>{item.item}</h4>
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