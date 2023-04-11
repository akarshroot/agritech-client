import React from 'react'
import currencyIcon from '../icons/currencyIcon.svg'

export default function CurrencyIconComponent(size) {
  return (
    <span>
        <img src={currencyIcon} height={size+"px"} width={size+"px"} alt='Currency' />
    </span>
  )
}
