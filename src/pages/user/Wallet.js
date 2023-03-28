import React, {useEffect, useState} from 'react'
import {useUser} from '../../context/UserContext'
import {getBalance} from '../../interceptors/web3ServerApi'

/*

{
  date: date,
  amountTransfered: Number,
  transfersTo: address,
}

*/

function Wallet() {
  const [balance,setBalance] = useState('--')
  const {userData} = useUser()
  const [transactions,setTransactions] = useState([])
  async function getBalanceFormServer(acc){

    const balance = await getBalance(acc)
    console.log(balance)
    setBalance(balance.amount)
  }

  useEffect(()=>{
      getBalanceFormServer(userData.walletAddress)
  },[])

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <h3>Address:</h3>
            </td>
            <td>
              <h5>{userData.walletAddress}</h5>
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
      </table>
      <div>
          {transactions.map(e => <div>{e}</div>)}
      </div>
    </div>
  )
}

export default Wallet