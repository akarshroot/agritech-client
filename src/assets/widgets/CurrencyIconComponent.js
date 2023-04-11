import React from 'react'
import icon from '../icons/currencyIcon.svg'
import './CurrencyIconComponent'

export default function CurrencyIconComponent(size) {
  
  return (
    <span height={size+"px"} width={size+"px"}>
      <img className='iconImg' src={icon} alt='coinIcon'/>
    </span>
  )
}
