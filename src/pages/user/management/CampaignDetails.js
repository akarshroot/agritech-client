import React, {useContext, useEffect, useState} from 'react'
import CampaignContext from '../../../context/CampaignContext'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import useInput from '../../../hooks/useInput'
import {Link, Navigate} from 'react-router-dom'
import {useUser} from '../../../context/UserContext'
import StoreContext from '../../../context/StoreContext'
import {ContributeModal} from '../Campaigns'
import {createVoteReq, getTransactionsForCamp, usevoteReq, voteForReq} from '../../../interceptors/web3ServerApi'
import './CampaignDetails.css'


function CreatorDetails({isOwner,imgUrl,name,email,walletAddress,openModal}){
 
  return(
    <div className='row shadow p-3 rounded'>
      <div className='col-12'>
        <div className='row justify-content-end'>
          <div className='col-2 pb-4'>
            <Button onClick={openModal} variant='success'>Contribute Here</Button>
          </div>
        </div>
      </div>
      <div className='col-md-4'>
        <img height='156px' width='156px' className='rounded-circle' src={imgUrl} alt='User profile Img here'/>
      </div>
      <div className='col-md-8'>
      {!isOwner
        ?<legend>Creator</legend>
        :<legend className='bg-success bg-opacity-50 rounded '>Your Campaign</legend>
      }
        <Table>
          <tbody className='text-start'>
            <tr>
              <th>Name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{email}</td>
            </tr>
            <tr>
              <th>WalletAddress</th>
              <td>{walletAddress}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}

function CampaignInfo({title,raisedAmount,target}){
  return(
    <div className='row mt-4 shadow p-3 rounded justify-content-around'>
      <div className='col-12'>
        <div className='display-2 text-start'>
            {title}
        </div>
      </div>
      <hr/>
      <div className='col-10 ms-4 text-start'>
        <div>
          <CampaignPrograssBar 
            raisedAmount={raisedAmount}
            target={target}
          />
        </div>
        <Table>
          <tbody>
            <tr>
              <th>Amount Raised so far:</th>
              <td>{raisedAmount} KCO</td>
            </tr>
            <tr>
              <th>Amount Target:</th>
              <td>{target} KCO</td>
            </tr>
            <tr>
              <th>Amount Required:</th>
              <td>{parseInt(target) - parseInt(raisedAmount)} KCO</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}

function CampaignPrograssBar({raisedAmount,target}){

  const progress = parseInt((raisedAmount / target) * 100)
  return (
    <div className="campaign-progress my-4">
        <div className="progress" style={{ height: "30px" }}>
            <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${progress}%` }}
              >
                {`${progress}%`}
            </div>
        </div>
    </div>
  )
}


function WithdrawRequests({cid,reason,amount,votes,voters,receiver,isOwner,voteNumber}){

  async function useRequest(){
    const password = await prompt('Enter Password to confirm')
    if(!password){
      return
    }
    const dataToSend = {
      voteNumber,
      password,
      cid
    }
    console.log(dataToSend)
    const res = await usevoteReq(dataToSend)
    alert(res.message)
  }
  
  
  async function voteRequest(e){
    const password = await prompt('enter Password to Confirm')
    if(!password){
      return
    }
    console.log(e.target.value)
    const dataToSend = {
      voteNumber,
      vote:e.target.value,
      cid,
      password
    }
    const res = await voteForReq(dataToSend)
    alert(res.message)
  }

  return(
    <div className='col-md-4'>
      <div className='m-2 p-2 shadow rounded text-start'>
        <div className='d-flex justify-content-between'>
          <div className='w-75'>
            <h3>{reason}</h3>
          </div>
          <div className='display-4 text-success'>
              {voteNumber}
          </div> 
        </div>
        <hr/>
        <Table>
          <tbody>
            <tr>
              <th>Amount requested:</th>
              <td>{amount} KCO</td>
            </tr>
            <tr>
              <th>Voters agreed:</th>
              <td>{votes}/{voters}</td>
            </tr>
          </tbody>
        </Table>
        <div>
          {parseInt(voters)===0? <div>No contributors yet</div>:<CampaignPrograssBar raisedAmount={votes} target={voters} />}
        </div>
        <div>
          Requested for : <Link to={`/agristore/product/${receiver}`}>Product</Link>
        </div>
        <div className='text-center py-3'>
          {!isOwner 
          ? <div><Button variant='outline-success' onClick={voteRequest} value='allow'>Allow</Button>   <Button onClick={voteRequest} value='dontAllow' variant='outline-danger'>Dont Allow</Button></div>
          : <Button onClick={useRequest} variant='danger'>Use Request</Button>
          }
        </div>
      </div>
    </div>
  )
}

function SelectFromCartOptions({setProd,product, hide}){
  function changeSelectId(){
    setProd(product)
    hide()
  }
  return(
    <div onClick={changeSelectId} value={product.id} className='row align-items-center p-3 m-0 border rounded custom-Options'>
      {product.imgUrl && (
        <div className='col-2'>
          <img src={product.imgUrl} alt='Product' />
        </div>
      )}
      <div className='col-10 d-flex flex-column justify-content-center'>
        <div><h4>{product.title}</h4></div>
        {product.price && <div>{product.price} KCO</div>}
      </div>
    </div>
  )
}

function CreateRequestModal({show, handleShow, vid}){

  const productSelect = {
    title:'<--Select-->',
    imgUrl:'',
    _id:'select',
    price:''
  }
  const productPersonal = {
    title:'Personal Wallet',
    imgUrl:'',
    _id:'personalUse',
    price:''
  }

  const reason = useInput('text','Tell them what you want')
  const amount = useInput('number','How much?')
  const password = useInput('password','enter password to confirm')
  const [dropdown,setDropdown] = useState(false)
  const [receiverProduct,setReceiverProduct] = useState(productSelect)
  const {activeCampaign} = useContext(CampaignContext)
  const {cart} = useContext(StoreContext)

  function handleDropdown(){
    setDropdown(!dropdown)
  }

  function closeModal(){
    setDropdown(false)
    handleShow()
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(receiverProduct._id==='select'){
      alert("select something from the dropdown")
      return
    }
    const dataToSend = {
      reason:reason.value,
      password:password.value,
      receiverProduct:receiverProduct._id,
      amount: amount.value? amount.value:'GetFromProduct',
      campaignId: activeCampaign._id
    }
    const res = await createVoteReq(dataToSend)
    alert(res.message)
  }

  return(
    <Modal
      show={show}
      onHide={closeModal}
      backdrop="static"
      keyboard={false}
      size='md'
    >
      <Modal.Header closeButton>
        <Modal.Title>Contribute</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Create a withdraw request</h4>
        <Form onSubmit={handleSubmit}>
          <div className='d-flex flex-column align-items-center'>
            <fieldset className='w-100'>
              <label htmlFor={'voteCampReason' + vid}>Reason</label><br />
              <input id={'voteCampReason' + vid} {...reason} />
            </fieldset>
            <fieldset className='w-100'>
              <label htmlFor={'voteCampreceiver' + vid}>Select Product (from Cart)</label><br />
              <div className='form-control position-relative bg-light custom-Options' name='receiver' id={'voteCampreceiver' + vid}>
                <div onClick={handleDropdown}>
                  <div className='row p-0 m-0 rounded '>
                    {receiverProduct.imgUrl && (
                      <div className='col-4'>
                        <img height='40px' width='40px' src={receiverProduct.imgUrl} alt='Product' />
                      </div>
                    )}
                    <div className='col-8 d-flex flex-column justify-content-center'>
                      <div>{receiverProduct.title}</div>
                      {receiverProduct.price && <div>{receiverProduct.price} KCO</div>}
                    </div>
                  </div>
                </div>
                {dropdown && (
                  <div className='position-absolute border rounded w-100 options-Bg'>
                    <SelectFromCartOptions 
                            setProd={setReceiverProduct} 
                            hide={handleDropdown}
                            product={productSelect}
                    />
                    {cart.length>0?
                      (
                        cart.map(({product},i) => {
                          // return <option 
                          //         key={'cartSelectKey'+i} 
                          //         value={product._id}>
                          //           {product.title}
                          //         </option>
                          return <SelectFromCartOptions 
                            key={'cartSelectKey'+i}
                            hide={handleDropdown}
                            setProd={setReceiverProduct} 
                            product={product}
                          />
                        })
                        )
                        : <div className='text-center'>---your cart is Empty---</div>
                    }
                    <SelectFromCartOptions 
                            setProd={setReceiverProduct} 
                            hide={handleDropdown}
                            product={productPersonal}/>
                  </div>
                  )}
              </div>
            </fieldset>
            {receiverProduct._id === 'personalUse'
            &&(
              <fieldset className='w-100'>
                <label htmlFor={'voteCampAmount' + vid}>Amount</label><br />
                <input id={'voteCampAmount' + vid} {...amount} />
              </fieldset>
              )
            }
            <fieldset className='w-100'>
              <label htmlFor={'voteCampPassFor' + vid}>Confirm with password</label><br />
              <input id={'voteCampPassFor' + vid} {...password} />
            </fieldset>
            <Button className='my-3' type='submit' variant="warning">Create Request</Button>
          </div>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function Transaction({ sno, receiverId, createdAt, amount, txHash}) { 
  return (
    <>
      <tr>
        <td>{sno}</td>
        <td>{receiverId}</td>
        <td>{amount}</td>
        <td>{createdAt}</td>
        <td>{txHash}</td>
      </tr>
    </>
  )
}
function TransactionsHistory({tx}){
  return(
    <div>
      <div>
        <legend>Campaign Transactions</legend>
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
            {tx.length? tx.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} />)
            : <tr><td colSpan='5'>No transactions yet</td></tr>}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

function CampaignVotesinfo({isOwner}){
  const [show,setShow] = useState(false);
  const {activeCampaign} = useContext(CampaignContext)
  const voteRequests = activeCampaign.voteRequests
  function handleShow(){
    setShow(!show);
  }
  const modalData={
    show,
    handleShow
  }
  return(
    <div className='row mt-4 shadow p-3 rounded justify-content-around'>
      {isOwner && (
        <div className='col-10'>
          <Button onClick={handleShow} variant='success'>+ Make a Request</Button>
        </div>
      )}
      <div>
        {voteRequests.length===0? <div className='py-3'>No Requests</div>
          : (
            <div>
            <hr/>
            <div className='row'>
              {voteRequests?.map((data,i) => {
                return (
                  <WithdrawRequests 
                    isOwner={isOwner} 
                    key={'votesContainerKey'+i} 
                    cid={activeCampaign._id} 
                    voters={activeCampaign.contributors.length} 
                    {...data}/>
                )
              })}
            </div>
            </div>
          )
        }
      </div>
      <CreateRequestModal {...modalData} />
    </div>
  )
}

export default function CampaignDetails() {
  
  const {activeCampaign,changeActiveCampaign} = useContext(CampaignContext)
  const {userData,loadingUser,getUserData} = useUser()
  const [show,setShow] = useState(false);
  function handleShow(){
    setShow(!show)
  }
  useEffect(()=>{
    if(loadingUser || !userData){
      getUserData()
    }
    if(!activeCampaign){
      changeActiveCampaign()
    }
  },[])
  if(!activeCampaign || !userData || loadingUser){
    return <div>Loading...</div>
  }
  const contributeModalData={
    show,
    handleShow,
    cid:activeCampaign._id,
    minContri:activeCampaign.minContri
  }
  const isOwner =  userData._id===activeCampaign.manager._id

  console.log(isOwner)

  return (
    <div className='container py-2'>
        <CreatorDetails {...activeCampaign.manager} isOwner={isOwner} openModal={handleShow} />
        <CampaignInfo {...activeCampaign} />
        <CampaignVotesinfo isOwner={isOwner} />
        <ContributeModal {...contributeModalData} />
        {activeCampaign.campaignTransactions && isOwner
        ?<TransactionsHistory tx={activeCampaign.campaignTransactions} />
        :<div className='p-4 display-3'>Only owner can see the transactions</div>
        }
    </div>
  )
}
