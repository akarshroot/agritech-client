import React, { useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'

function Sales() {
  const navigate = useNavigate()
  const { theme, userData, currentUser, getUserData } = useUser()

  useEffect(() => {
    if (currentUser && !userData) getUserData()
  }, [currentUser])

  return (
    <>
      <div className={`planning-container theme-${theme}`}>
        <div className="planning-header">
          <Button className="link m-2" onClick={() => navigate("/management")} variant='warning'>&larr; Go back</Button>
          <div className="m-2">
            <h3>SALES</h3>
            <span className="subtext">Review and analyse historic sales of your different crops to facilitate better planning for the next harvest.</span>
          </div>
        </div>
        <hr className="style-two" />
        <div className="planning-content">
          {
            userData ? userData.sales ? <></>
            :
            <>No sales data yet.</>
            :
            <>Loading...</>
          }
        </div>
      </div>
    </>
  )
}

export default Sales