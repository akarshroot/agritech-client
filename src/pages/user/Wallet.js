import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getBalance, transferKCO } from '../../interceptors/web3ServerApi'
import useInput from '../../hooks/useInput'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import CurrencyIconComponent from '../../assets/widgets/CurrencyIconComponent'

function TransferModule() {
  const [show, setShow] = useState(false)
  const addressTo = useInput('text', 'where to send')
  const amountTo = useInput('number', 'how much to send')
  const password = useInput('password', 'Enter password')
  const { userData } = useUser()

  function handleShow() { setShow(!show) }

  async function transfer(e) {
    e.preventDefault()
    const data = {
      addressFrom: userData.walletAddress,
      addressTo: addressTo.value,
      amount: amountTo.value,
      password: password.value
    }
    const res = await transferKCO(data)
    if(res.status ==='success'){
      console.log(addressTo.onChange)
      addressTo.onChange({target:{value:''}})
      amountTo.onChange({target:{value:''}})
      password.onChange({target:{value:''}})
      alert(res.message)
    }
    console.log(res)
  }
  return (
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

function Transaction({ sno, to, date, amount, txHash }) {
  return (
    <>
      <tr>
        <td>{sno}</td>
        <td>{to}</td>
        <td>{amount}</td>
        <td>{date}</td>
        <td>{txHash}</td>
      </tr>
    </>
  )
}


function Wallet() {
  const [balance, setBalance] = useState(-1)
  const [balanceLoader, setBalanceLoader] = useState(false)
  const { userData, getUserData } = useUser()

  async function getBalanceFormServer(acc) {
    setBalanceLoader(true)
    const balance = await getBalance(acc)
    setBalance(balance.amount)
    console.log("set!!", balance.amount);
    setBalanceLoader(false)
  }

  async function buyKCO() {

  }
  console.log(userData?.transactions)
  useEffect(() => {
    if(userData)
      getBalanceFormServer(userData.walletAddress)
    else getUserData()
  }, [userData])

  return (
    <div className='container pt-4'>
      <div className='row align-items-center'>
        <div className='col-xl-6 p-4'>

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
                  <h4> <CurrencyIconComponent size={56} /> {!balanceLoader ? Math.floor(balance) : "Loading..."} KCO
                    {/* <sub>{balance}</sub> */}
                  </h4>
                </td>
              </tr>

            </tbody>
          </Table>
          <div>
            <Button variant='warning' onClick={buyKCO}>Buy More KCO</Button>
          </div>
        </div>
        <div className='col-xl-6 p-4'>
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
              {userData && userData.transactions.length? userData.transactions.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} />)
              : <tr><td colSpan='5'>No transactions yet</td></tr>}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Wallet