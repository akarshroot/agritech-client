import React, { useContext, useEffect, useRef, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getBalance, getTransactions, transferKCO } from '../../interceptors/web3ServerApi'
import CampaignContext from '../../context/CampaignContext'
import useInput from '../../hooks/useInput'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import './Wallet.css'
import StoreContext from '../../context/StoreContext'


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
    if (res.status === 'success') {
      console.log(addressTo.onChange)
      addressTo.onChange({ target: { value: '' } })
      amountTo.onChange({ target: { value: '' } })
      password.onChange({ target: { value: '' } })
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

function Transaction({ sno, receiverId, createdAt, amount, txHash, camp, changeActiveCamp }) {
  function checkCampaign() {
    console.log(receiverId)
    changeActiveCamp(receiverId)
  }

  return (
    <>
      <tr>
        <td>{sno}</td>
        {camp
          ? <td><span onClick={checkCampaign} className='Camplink'>{receiverId}</span></td>
          : <td>{receiverId}</td>
        }
        <td>{amount}</td>
        <td>{createdAt}</td>
        <td>{txHash}</td>
      </tr>
    </>
  )
}

function Wallet() {
  const [balance, setBalance] = useState()
  const amountRef = useRef()
  const currencyRef = useRef()
  const [amount, setAmount] = useState(1)
  const [amountToKCO, setAmountToKCO] = useState(0)

  const password = useInput('password','Confirm with pass');
  const [balanceLoader, setBalanceLoader] = useState(false)
  const [walletTx, setWalletTx] = useState([])
  const [campsTx, setCampsTx] = useState([])
  const { userData, getUserData, theme, getOrderId, verifyPayment } = useUser()
  const { changeActiveCampaign } = useContext(CampaignContext)

  const [openBuyModal, setBuyModal] = useState(false)

  const { INR } = useContext(StoreContext)

  function handleBuyModal() {
    setAmount(1)
    setAmountToKCO(0)
    setBuyModal(!openBuyModal)
  }

  async function getBalanceFormServer(acc) {
    setBalanceLoader(true)
    const balance = await getBalance(acc)
    setBalance(balance.amount)
    console.log("set!!", balance.amount);
    setBalanceLoader(false)
  }

  async function buyKCO() {
    const purchaseData = {
      amount: amount,
      currency: "INR",
    }
    const orderData = await getOrderId(purchaseData);
    console.log(orderData);
    const options = {
      key: process.env.REACT_APP_RAZORPAY_ID,
      amount: orderData.amountDue, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: orderData.currency,
      name: `Buying ${amountToKCO} KCO`,
      description: "Buy KCO",
      image: "",
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const data = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            walletAddress: userData.walletAddress,
            amount,
            password:password.value
          }
          await verifyPayment(data)
          handleBuyModal()
          getBalanceFormServer(userData.walletAddress)
        } catch (error) {
          alert(error)
        }
      },
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      notes: {
        address: "AgriTech"
      },
      theme: {
        color: "#40513B"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open()
  }
  useEffect(() => {
    setAmountToKCO(amount !== "Invalid amount" ? amount - 1 : amount)
  },[amount])
  useEffect(() => {
    if (userData) {
      getBalanceFormServer(userData.walletAddress)
      getTransactions().then(e => {
        console.log(e)
        setWalletTx(e.wallet)
        setCampsTx(e.camps)
      })
    } else getUserData()
  }, [userData])

  return (
    <div className="container pt-4">
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
                  <h4>{!balanceLoader ? balance: "Loading..."} KCO
                  </h4>
                </td>
              </tr>

            </tbody>
          </Table>
          <div>
            <Button variant='warning' onClick={handleBuyModal}>Buy More KCO</Button>
            <Modal
              show={openBuyModal}
              onHide={handleBuyModal}
              backdrop="static"
              keyboard={false}
              size='md'
            >
              <Modal.Header closeButton>
                <Modal.Title>Buy KCO</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className='form-control'>
                  <div className={'alert alert-warning theme-' + theme} hidden={!(amountToKCO === "Invalid amount" || amountToKCO === 0)}>&#9432; Minimum 1 KCO must be bought <br /> Therefore minimum amount is {INR.format(2)}</div>
                  <div className='d-flex flex-column justify-content-center align-items-center'>
                    <fieldset className='m-1'>
                      <label htmlFor='amountKCO'>Amount</label><br />
                      <input className='form-control' id='amountKCO' type='number' min={2} onChange={(e) => { e.target.value < 2 ? setAmount("Invalid amount") : setAmount(e.target.value) }} ref={amountRef} />
                    </fieldset>
                    <fieldset className='m-1'>
                      <label htmlFor='currency'>Currency</label><br />
                      <input className='form-control' id='currency' ref={currencyRef} value={"INR"} disabled={true} />
                    </fieldset>
                    <fieldset className='m-1'>
                      <label htmlFor='passwordToPurchase'>Password</label><br />
                      <input id='passwordToPurchase' {...password} />
                    </fieldset>
                  </div>
                  <div className='d-flex justify-content-center align-items-center'>
                    <fieldset className='m-1 d-flex align-items-center'>
                      <Button variant='warning' className='m-1' disabled>&#61;</Button>
                      <input ref={currencyRef} value={amountToKCO === "Invalid amount" ? `${amountToKCO}` : amountToKCO + " KCO"} disabled={true} />
                    </fieldset>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleBuyModal}>
                  Cancel
                </Button>
                <Button className='my-3' type='submit' variant="success" disabled={amountToKCO == "Invalid amount" || amountToKCO == 0} onClick={buyKCO}>Buy</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className='col-xl-6 p-4'>
          <TransferModule />
        </div>
      </div>
      <div>
        <div>
          <legend>Wallet Transactions</legend>
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
              {userData && walletTx.length ? walletTx.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} />)
                : <tr><td colSpan='5'>No transactions yet</td></tr>}
            </tbody>
          </Table>
        </div>
      </div>
      <div>
        <div>
          <legend>Contributions</legend>
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
              {userData && campsTx.length ? campsTx.map((e, i) => <Transaction key={'contributionsHashKey' + i} camp='true' changeActiveCamp={changeActiveCampaign} sno={i + 1} {...e} />)
                : <tr><td colSpan='5'>No transactions yet</td></tr>}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Wallet