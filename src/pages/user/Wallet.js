import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getBalance, getTransactions, transferKCO } from '../../interceptors/web3ServerApi'
import CampaignContext from '../../context/CampaignContext'
import useInput from '../../hooks/useInput'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './Wallet.css'
/*

{
  date: date,
  amountTransfered: Number,
  transfersTo: address,
}

*/

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

function Transaction({ sno, receiverId, createdAt, amount, txHash, camp ,changeActiveCamp}) {
  function checkCampaign(){
    console.log(receiverId)
    changeActiveCamp(receiverId)
  }

  return (
    <>
      <tr>
        <td>{sno}</td>
        {camp
        ?<td><span onClick={checkCampaign} className='Camplink'>{receiverId}</span></td>
        :<td>{receiverId}</td>
        }
        <td>{amount}</td>
        <td>{createdAt}</td>
        <td>{txHash}</td>
      </tr>
    </>
  )
}

// function AddKCOModal({ show, handleShow }) {
//   return (
//     <>
//       <Modal
//         show={show}
//         onHide={handleShow}
//         backdrop="static"
//         keyboard={false}
//         size='lg'
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Create Campaign</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>


//             <div className='d-flex flex-column align-items-center'>
//               <fieldset>
//                 <label htmlFor='createCampTitle'>Title</label><br />
//                 <input id='createCampTitle' {...title} />
//               </fieldset>
//               <fieldset>
//                 <label htmlFor='createCampDeadline'>Deadline</label><br />
//                 <input id='createCampDeadline' {...deadline} />
//               </fieldset>
//               <fieldset>
//                 <label htmlFor='createCampTarget'>Target</label><br />
//                 <input id='createCampTarget' {...target} />
//               </fieldset>
//               <fieldset>
//                 <label htmlFor='createCampMinAmount'>Mininmum Amount</label><br />
//                 <input id='createCampMinAmount' {...minContribution} />
//               </fieldset>
//               <fieldset>
//                 <label htmlFor='createCampPass'>Password</label><br />
//                 <input id='createCampPass' {...password} />
//               </fieldset>
//               <Button className='my-3' type='submit' variant="success">Create</Button>
//             </div>

//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleShow}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>


//       <div className="wallet-modal">
//         <div className="wallet-modal-overlay"></div>
//         <div className="wallet-modal-body">
//           <button style={{ float: "right" }} onClick={() => { toggleAddBalanceModal(!addBalanceModalIsOpen) }}>X</button>
//           <div className="add-balance-content">
//             <p>Enter amount of CursorCoins you wish to add:</p>
//             <div className="bounty-input">
//               <input style={{ width: "260px" }} placeholder="Eg. 1000" type="number" step="0.01" min="0.01" name='amount' value={addBalanceInputs.amount} onChange={(e) => {
//                 inputEvent(e)
//               }} />
//             </div>
//             <div className="bounty-input">
//               <p>Select your preferred currency of payment.</p>
//               <select style={{ width: "100px" }} type="" name='currency' value={addBalanceInputs.currency} onChange={inputEvent}>
//                 <option value="INR">INR</option>
//                 <option value="USD">USD</option>
//               </select>
//             </div>
//             <span className='wallet-modal-subtext'>&#128712; Note that 1 CursorCoin = 1 USD</span>
//             <div className="bounty-input">
//               <input type="text" style={{ width: "fit-content" }} readOnly={true} value={`${addBalanceInputs.amount === "" ? "0" : parseFloat(addBalanceInputs.amount)?.toFixed(2)} CC = ` + (addBalanceInputs.currency === "USD" ? `$${addBalanceInputs.amount == '' ? 0 : (addBalanceInputs.amount)}` : `₹${addBalanceInputs.amount == '' ? 0 : ((addBalanceInputs.amount) * USD_INR_CONVERSION_FACTOR).toFixed(2)}`)} />
//             </div>
//             <button class="button-6" role="button" onClick={() => beginPayment(addBalanceInputs.currency, addBalanceInputs.amount, userData, toastContainer)}>Proceed to Pay {addBalanceInputs?.actualAmount}</button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


function Wallet() {
  const [balance, setBalance] = useState(-1)
  const [balanceLoader, setBalanceLoader] = useState(false)
  const [walletTx,setWalletTx] = useState([])
  const [campsTx,setCampsTx] = useState([])
  const { userData, getUserData } = useUser()
  const {changeActiveCampaign} = useContext(CampaignContext)

  async function getBalanceFormServer(acc) {
    setBalanceLoader(true)
    const balance = await getBalance(acc)
    setBalance(balance.amount)
    console.log("set!!", balance.amount);
    setBalanceLoader(false)
  }

  async function buyKCO() {

  }
  useEffect(() => {
    if(userData){
    getBalanceFormServer(userData.walletAddress)
    getTransactions().then(e => {
      console.log(e)
      setWalletTx(e.wallet)
      setCampsTx(e.camps)
    })
    }else getUserData()
  }, [])

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
                  <h4>{!balanceLoader ? Math.floor(balance) : "Loading..."} KCO
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
              {userData && walletTx.length? walletTx.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} />)
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
              {userData && campsTx.length? campsTx.map((e, i) => <Transaction key={'contributionsHashKey' + i} camp='true' changeActiveCamp={changeActiveCampaign} sno={i + 1} {...e} />)
              : <tr><td colSpan='5'>No transactions yet</td></tr>}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Wallet