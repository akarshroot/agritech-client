import React, {useEffect, useState} from 'react'
import {useUser} from '../../context/UserContext'
import {getBalance, transferKCO} from '../../interceptors/web3ServerApi'
import useInput from '../../hooks/useInput'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
/*

{
  date: date,
  amountTransfered: Number,
  transfersTo: address,
}

*/

const DummyTransaction = [
  {
    txhash: '82734y52374f5y23rdjty29347805y34djsr312845',
    amount: 1000,
    toAddress: '0921384ka9123754892734013892k4214c215nv103',
    date: new Date().toString()
  },
  {
    txhash: '82734y52374f5y23rdjty29347805y34djsr312845',
    amount: 100,
    toAddress: '0921384ka9123754892734013892k4214c215nv103',
    date: new Date().toString()
  },
  {
    txhash: '82734y52374f5y23rdjty29347805y34djsr312845',
    amount: 3000,
    toAddress: '0921384ka9123754892734013892k4214c215nv103',
    date: new Date().toString()
  },
  {
    txhash: '82734y52374f5y23rdjty29347805y34djsr312845',
    amount: 6000,
    toAddress: '0921384ka9123754892734013892k4214c215nv103',
    date: new Date().toString()
  },
]

function TransferModule(){
  const [show, setShow] = useState(false)
  const addressTo = useInput('text','where to send')
  const amountTo = useInput('number','how much to send')
  const password = useInput('password','Enter password')
  const {userData} = useUser()

  function handleShow(){setShow(!show)}

  async function transfer(e){
    e.preventDefault()
    const data = {
      addressFrom: userData.walletAddress,
      addressTo:addressTo.value,
      amount:amountTo.value,
      password:password.value
    }
    const res = await transferKCO(data)
    console.log(res)
  }
  return(
    <Form onSubmit={transfer} className='shadow p-3 text-start'>
      <fieldset className='py-2'>
        <label htmlFor='transferInputAddress'>Address:</label>
        <input id='transferInputAddress' className='form-control' {...addressTo} />
      </fieldset>
      <fieldset className='py-2'>
        <label htmlFor='transferInputAmount'>Amount (in KCO)</label>
        <input id='transferInputAmount' className='form-control' {...amountTo} />
      </fieldset>
      <fieldset className='py-2'>
        <label htmlFor='transferInputPassword'>Password:</label>
        <input id='transferInputPassword' className='form-control' {...password} />
      </fieldset>
      <Button type='submit' onClick={handleShow} variant='outline-success' >Transfer KCO</Button>
    </Form>
  )
}

function Transaction({sno,toAddress,date,amount,txhash}){
  return(
    <>
        <tr>
          <td>{sno}</td>
          <td>{toAddress}</td>
          <td>{amount}</td>
          <td>{date}</td>
          <td>{txhash}</td>
        </tr>
    </>
  )
}

function Wallet() {
  const [balance,setBalance] = useState('--')
  const {userData} = useUser()
  const [transactions,setTransactions] = useState(DummyTransaction)
  async function getBalanceFormServer(acc){

    const balance = await getBalance(acc)
    setBalance(balance.amount)
  }

  useEffect(()=>{
      getBalanceFormServer(userData?.walletAddress)
  },[])

  return (
    <div className='container pt-4'>
      <div className='row align-items-center'>
        <div className='col-md-6 p-4'>
          <Table>
            <tbody>
              <tr>
                <td>
                  <h3>Address:</h3>
                </td>
                <td>
                  <h5>{userData?.walletAddress}</h5>
                </td>
              </tr>

              <tr>
                <td>
                  <h3>Balance:</h3>
                </td>
                <td>
                  <h4>{Math.floor(balance)} KCO
                  {/* <sub>{balance}</sub> */}
                  </h4>
                </td>
              </tr>

            </tbody>
          </Table>
          <div>
            <Button variant='warning' >Buy More KCO</Button>
          </div>
        </div>
        <div className='col-md-6 p-4'>
          <TransferModule />
        </div>
      </div>
      <div>
        <div>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th>S.No</th>
                <th>To</th>
                <th>Amount</th>
                <th>Date</th>
                <th>TransactionHash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((e,i) => <Transaction key={'transactionHashKey'+i} sno={i+1} {...e} />)}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Wallet