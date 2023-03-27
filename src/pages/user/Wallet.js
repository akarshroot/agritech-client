import React, {useEffect, useState} from 'react'
import {getBalance} from './management/web3ServerApi/web3ServerApi'

const hardCodedAccount = '0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637'

/*

{
  date: date,
  amountTransfered: Number,
  transfersTo: address, 
}

*/

function Wallet() {
  
  const [balance,setBalance] = useState(0)
  const [account,setAccount] = useState(hardCodedAccount)

  const [transactions,setTransactions] = useState([])
  async function getBalanceFormServer(acc){

    const balance = await getBalance(acc)
    console.log(balance)
    setBalance(balance.amount)
  }

  useEffect(()=>{
    getBalanceFormServer(account)
  },[])

  return (
    <div>
      <tbody>
        <tr>
          <td>
            <h3>Address:</h3>
          </td>
          <td>
            <h4>{account}</h4>
          </td>
        </tr>
        <tr>
          <td>
            <h3>Balance:</h3>
          </td>
          <td>
            <h4>{balance} KCO</h4>
          </td>
        </tr>
      </tbody>
      <div>
          {transactions.map(e => <div>{e}</div>)}
      </div>
    </div>
  )
}

export default Wallet