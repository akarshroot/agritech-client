import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import { useNavigate } from 'react-router-dom'

function Forbidden() {
  const navigate = useNavigate()

  return (
    <div>
        <h2 className='display-5'>Forbidden Route</h2>
        <Button variant='warning' onClick={()=> navigate("/dashboard")}>&larr; Go Back</Button>
    </div>
  )
}

export default Forbidden