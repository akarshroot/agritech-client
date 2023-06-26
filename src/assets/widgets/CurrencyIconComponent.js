import React from 'react'
import icon from '../icons/currencyIcon.png'
import './CurrencyIconComponent.css'

export default function CurrencyIconComponent({size,adjustX=0,adjustY=0}) {
  
  return (
    <span className='mx-1'>
      <img loading='lazy' style={{translate: `${adjustX} ${adjustY}`}} height={size+"px"} width={size+"px"} className='iconImg' src={icon} alt='coinIcon'/>
    </span>
  )
}
