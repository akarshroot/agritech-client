import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import Button from 'react-bootstrap/esm/Button'

function Inventory() {
  
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
            <h3>INVENTORY</h3>
            <span className="subtext">Review and analyse your inventory to plan new requirements.</span>
          </div>
        </div>
        <hr className="style-two" />
        <div className="planning-content">
          
        </div>
      </div>
    </>

  )
}

export default Inventory