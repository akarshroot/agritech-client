import React, { useContext, useEffect, useRef, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getBalance, getTransactions, transferKCO } from '../../interceptors/web3ServerApi'
import CampaignContext from '../../context/CampaignContext'
import useInput from '../../hooks/useInput'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import './Wallet.css'
import StoreContext from '../../context/StoreContext'


function TransferModule() {
  const [show, setShow] = useState(false)
  const addressTo = useInput('text', 'where to send')
  const amountTo = useInput('number', 'how much to send')
  const password = useInput('password', 'Enter password')
  const [loading,setLoading] = useState(false);
  const { userData } = useUser()

  function handleShow() { setShow(!show) }

  async function transfer(e) {
    e.preventDefault()
    setLoading(true)
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
    setLoading(false)
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
      {
        loading
        ?<Button variant='disabled'>Transfering... <Spinner variant='secondary'/> </Button>
        :<Button type='submit' onClick={handleShow} variant='outline-success'>Transfer KCO</Button>
      }
    </Form>
  )
}

function Transaction({ showHashes,sno, receiverId, userId, createdAt, amount, txHash, camp, changeActiveCampaign }) {
  
  const recivedPaid = receiverId === userId

  function checkCampaign() {
    changeActiveCampaign(receiverId)
  }
  const formattedDate = new Date(createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')
  return (
    <>
      <tr>
        <td>{sno}</td>
        {camp
          ? <td><span onClick={checkCampaign} className='Camplink'>{receiverId}</span></td>
          : <td>{receiverId}</td>
        }
        <td
          className={`text-${userId && (recivedPaid? 'success':'danger')}`}
        >{userId && (recivedPaid? '+':'-')}{amount}</td>
        <td>
          <h6 className='d-inline'>on:</h6> {formattedDate[0]}
          <br/>
          <h6 className='d-inline'>at:</h6> {formattedDate[1]}
        </td>
        {showHashes && <td>{txHash}</td>}
      </tr>
    </>
  )
}

function TransactionHistory({label,userId,tx,links}){
  const { changeActiveCampaign } = useContext(CampaignContext)
  const [showHashes,setShowHashes] = useState(false)

  function hideShowHashes(){setShowHashes(!showHashes)}
  let options={
    showHashes,
    userId
  }
  if(links){
    options = {
      ...options,
      changeActiveCampaign,
      camp:true
    }
  }

  return(
    <div className='col-12 table-responsive'>
      <legend>{label}</legend>
      <p onClick={hideShowHashes} className='text-end Camplink'>{!showHashes? 'Show':'Hide'} hashes</p>
      <Table className='w-100' striped bordered>
        <thead>
          <tr>
            <th>S.No</th>
            <th>To/From</th>
            <th>Amount</th>
            <th>Time</th>
            {showHashes && <th>TransactionHash</th>}
          </tr>
        </thead>
        <tbody>
          {userId && tx.length ? tx.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} {...options} />)
            : <tr><td colSpan='5'>No transactions yet</td></tr>}
        </tbody>
      </Table>
    </div>
  )
}

function AddKCOModal({theme, getOrderId, verifyPayment,getBalanceFormServer,userData,setShowBuyModal,openBuyModal}){
  const amountRef = useRef()
  const currencyRef = useRef()
  const password = useInput('password','Confirm with pass');
  const [amount, setAmount] = useState(1)

  
  const [amountToKCO, setAmountToKCO] = useState(0)
  const { INR } = useContext(StoreContext)

  useEffect(() => {
    setAmountToKCO(amount !== "Invalid amount" ? amount - 1 : amount)
  },[amount])

  function handleBuyModal() {
    setAmount(1)
    setAmountToKCO(0)
    setShowBuyModal(!openBuyModal)
  }

  async function buyKCO() {
    const purchaseData = {
      amount: amount,
      currency: "INR",
    }
    const orderData = await getOrderId(purchaseData);
    console.log(orderData.id);
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
          console.log(error)
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

  return (
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
        <Button className='my-3' type='submit' variant="success" disabled={amountToKCO === "Invalid amount" || amountToKCO+'' === '0'} onClick={buyKCO}>Buy</Button>
      </Modal.Footer>
    </Modal>
  )
}

function Wallet() {

  const [balance, setBalance] = useState()
  const [balanceLoader, setBalanceLoader] = useState(false)

  const [walletTx, setWalletTx] = useState([])
  const [campsTx, setCampsTx] = useState([])

  const { userData, getUserData, theme, getOrderId, verifyPayment } = useUser()

  const [showAddress,setShowAddress] = useState(false)
  const [openBuyModal,setShowBuyModal] = useState(false)

  function hideShowAddress(){setShowAddress(!showAddress)}

  async function getBalanceFormServer(acc) {
    setBalanceLoader(true)
    const balance = await getBalance(acc)
    setBalance(balance.amount)
    console.log("set!!", balance.amount);
    setBalanceLoader(false)
  }
  
  useEffect(() => {
    if (userData) {
      getBalanceFormServer(userData.walletAddress)
      getTransactions().then(e => {
        console.log(e)
        setWalletTx(e.wallet.reverse())
        setCampsTx(e.camps.reverse())
      })
    } else getUserData()
  }, [getUserData, userData])

  const buyModalOptions ={
    theme,
    getOrderId,
    verifyPayment,
    userData,
    openBuyModal,
    setShowBuyModal,
    getBalanceFormServer,
  }

  return (
    <div className="container py-4">
      <div className='row align-items-center'>
        <div className='col-xl-6 p-4'>

          <Table>
            <tbody>
              {
                showAddress
                ?(
                  <tr>
                    <td>
                      <h3>Address:</h3>
                    </td>
                    <td>
                      <h5 className='AddressClass' title='Copy' onClick={() => {navigator.clipboard.writeText(userData?.walletAddress)}} >{userData?.walletAddress}
                        <sub className='text-end'>
                          <p onClick={hideShowAddress} className='Camplink mt-2'>Hide Address</p>
                        </sub>
                      </h5>
                    </td>
                  </tr>)
                :(
                  <tr>
                    <td>
                      <h3>Address:</h3>
                    </td>
                    <td>
                      <p onClick={hideShowAddress} className='Camplink'>Show Address</p>
                    </td>
                  </tr>
                )
              }

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
            <Button variant='warning' onClick={setShowBuyModal}>Buy More KCO</Button>
            <AddKCOModal {...buyModalOptions} />
          </div>
        </div>
        <div className='col-xl-6 p-4'>
          <TransferModule />
        </div>
      </div>

      <div className='row flex-column rounded shadow'>
        {userData && (
        <>
          <TransactionHistory label={'Wallet Transactions'} userId={userData._id} tx={walletTx} />
          <TransactionHistory label={'Your Contributions'} links={true} userId={userData._id} tx={campsTx} />
        </>
        )}
      </div>
    </div>
  )
}

export default Wallet