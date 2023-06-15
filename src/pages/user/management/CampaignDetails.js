/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'

import { ContributeModal } from '../Campaigns'
import useInput from '../../../hooks/useInput'
import { useUser } from '../../../context/UserContext'
import StoreContext from '../../../context/StoreContext'
import Loader from '../../../assets/loader/Loader'
import AlreadyContributed from '../../../assets/icons/tick-box.svg'
import {getCampbyId} from '../../../interceptors/serverAPIs'
import { createVoteReq, usevoteReq, voteForReq } from '../../../interceptors/web3ServerApi'

import './CampaignDetails.css'


function CreatorDetails({ refPass,isOwner, imgUrl, name, email, walletAddress, openModal }) {
  const [showWalletAdd,setShowWalletAdd] = useState(false);
  return (
    <div ref={refPass}>
      <div>
        <div className='d-flex justify-content-end pe-1 pt-1'>
          <button onClick={openModal} className='campDonateButton'>Contribute Here</button>
        </div>
      </div>
      <div className='d-flex flex-column justify-content-center p-3 m-3 border h-100'>
        {!isOwner
          ? <legend>Creator</legend>
          : <legend className='bg-success bg-opacity-50 rounded '>Your Campaign</legend>
        }
        <div className='p-2'>
          <img height='156px' width='156px' className='rounded-circle' src={imgUrl} alt='User profile Img here' />
        </div>
        <div>
          <Table responsive>
            <tbody className='text-start'>
              <tr>
                <th>Name</th>
                <td>{name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{email}</td>
              </tr>
              {showWalletAdd
                &&(<tr>
                    <th>WalletAddress</th>
                    <td>{showWalletAdd? walletAddress:<p className='CampLink'>Show Address</p>}</td>
                  </tr>)
              }
            </tbody>
          </Table>
          <span onClick={()=>{setShowWalletAdd(!showWalletAdd)}} className='Camplink m-4'>{!showWalletAdd? "Show" : "Hide"} Wallet Address</span>
          <div className='ViewProfileButtonContainer'>
              <button className='ViewProfileButton'>
                View Profile
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampaignDescription({refPass,description}){
  return (
    <div ref={refPass} className='text-start p-3 ps-5'>
      <h3 className='p-0 m-0'>
          Description
      </h3>
      <hr/>
      <div className='descriptionContent'>
        <div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(description)}}>
        </div>
      </div>
      <hr/>
    </div>
  )
}

function CampaignPledgesAndPromises({refPass}){
  return (
    <div ref={refPass}>
      <div className='text-start p-3'>
        <h3 className='p-0 m-0'>
            Plegdes and Promises
        </h3>
      </div>
    </div>
  )
}

function CampaignInfo({ refPass,title, raisedAmount, target, contributors,featuredImage }) {
  const { currentUser } = useUser()
  return (
    <div ref={refPass}>
      <div className='p-3'>
        <div className='text-start'>
          <h1>{title}</h1>
          {
            contributors.find(contributor => contributor.userId === currentUser) ?
              <img src={AlreadyContributed} width="80px" height="80px" alt="" />
              : <></>
          }
        </div>
      </div>
      <hr />
      <div className='campFeaturedImageContainer' >
          <img className='campFeaturedImage w-100' src={featuredImage} alt='FeaturedImage' />
      </div>
      <div className='mx-5 text-start '>
        <div>
          <CampaignPrograssBar
            raisedAmount={raisedAmount}
            target={target}
          />
        </div>
        <div className=''>
          <Table>
            <tbody>
              <tr>
                <th>Amount Raised so far:</th>
                <td>{raisedAmount}</td>
                <td>KCO</td>
              </tr>
              <tr>
                <th>Amount Target:</th>
                <td>{target}</td>
                <td>KCO</td>
              </tr>
              <tr>
                <th>Amount Required:</th>
                <td>{parseInt(target) - parseInt(raisedAmount)}</td>
                <td>KCO</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function TransactionsHistory({ refPass,tx }) {
  return (
    <div ref={refPass}>
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
            {tx.length ? tx.map((e, i) => <Transaction key={'transactionHashKey' + i} sno={i + 1} {...e} />)
              : <tr><td colSpan='5'>No transactions yet</td></tr>}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

function CampaignVotesinfo({ refPass,isOwner, voteRequests, _id, contributors,userId }) {
  const [show, setShow] = useState(false);
  function handleShow() {
    setShow(!show);
  }
  const modalData = {
    show,
    handleShow
  }
  return (
    <div ref={refPass}>
      {isOwner && (
          <Button onClick={handleShow} variant='success'>+ Make a Request</Button>
      )}
      <div>
        {voteRequests.length === 0 ? <div className='py-3'>No Requests</div>
          : (
            <div>
              <hr />
              <div className='row'>
                {voteRequests?.map((data, i) => {
                  console.log(data)
                  return (
                    <WithdrawRequests
                      isOwner={isOwner}
                      toPersonal={userId===data.receiver}
                      key={'votesContainerKey' + i}
                      cid={_id}
                      voters={contributors.length}
                      {...data} />
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

function CampaignPlanDetails({refPass,title,requirements,...props}){
  return(
    <div ref={refPass}>
      <div className='p-3 text-start'>
        <h3 className='p-0 m-0'>
          Plan - {title}
        </h3>
      </div>
      <div className='CampPlanRequirements rounded row m-0 p-2'>
          {requirements.map((e,key) => {
            return(
              <div className='col-md-4' key={'campPlanRequirements'+key}>
                <div className='eachRequiredProduct rounded bg-white p-3 shadow'>
                  <Table striped>
                    <tbody>
                      <tr>
                        <th>Type:</th>
                        <td>{e.category}</td>
                      </tr>
                      <tr>
                        <th>Item:</th>
                        <td>{e.item}</td>
                      </tr>
                      <tr>
                        <th>Price:</th>
                        <td>{e.estCost}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function CampaignNavigation({refs,title}){
  console.log(refs)
  return(
    <div className='CampaignNavigationNavigation p-3'>
      <div className='innerCampaignNavigationNavigation p-4 shadow rounded'>
        <h5 className='m-0'>
          {title}
        </h5>
        <hr/>
        <ul>
          <li><button className='campNavInternalLinkingButton' onClick={()=>{refs.details.current.scrollIntoView()}}>Start</button></li>
          <li><button className='campNavInternalLinkingButton' onClick={()=>{refs.description.current.scrollIntoView()}}>Description</button></li>
          <li><button className='campNavInternalLinkingButton' onClick={()=>{refs.pledges.current.scrollIntoView()}}>Plegdes and Promises</button></li>
          <li><button className='campNavInternalLinkingButton' onClick={()=>{refs.votes.current.scrollIntoView()}}>Withdraw requests</button></li>
          <li><button className='campNavInternalLinkingButton' onClick={()=>{refs.plans.current.scrollIntoView()}}>Plan</button></li>
        </ul>
      </div>
    </div>
  )
}

///
function CampaignPrograssBar({ raisedAmount, target }) {

  const progress = parseInt((raisedAmount / target) * 100)
  return (
    <div className="campaign-progress my-4">
      Progress-
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
function WithdrawRequests({ cid, reason, amount, votes, voters, receiver, isOwner, voteNumber,toPersonal }) {

  const [loading, setLoading] = useState(false)
  const [prompt, openPrompt] = useState(false)
  const [password, setPassword] = useState("")

  const handlePrompt = () => openPrompt(!prompt)
  const handleChange = (e) => {
    setPassword(e.target.value)
  }


  console.log('Receiver->',toPersonal)
  console.log('Receiver->')
  async function useRequest() {
    if (!password) {
      return
    }
    const dataToSend = {
      voteNumber,
      password,
      cid
    }
    console.log(dataToSend)
    setLoading(true)
    const res = await usevoteReq(dataToSend)
    handlePrompt()
    if (res.error) {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setLoading(false)
  }

  async function voteRequest(e) {
    if (!password) {
      return
    }
    setLoading(true)
    console.log(e.target.value)
    const dataToSend = {
      voteNumber,
      vote: e.target.value,
      cid,
      password
    }
    const res = await voteForReq(dataToSend)
    handlePrompt()
    if (res.error) {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setLoading(false)
  }

  return (
    <div className='col-md-4'>

      <Modal show={prompt} onHide={handlePrompt}>
        <Modal.Header closeButton>
          <Modal.Title>Authenticate</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
          <input placeholder='Password' onChange={(e) => { handleChange(e) }} type="password" name='password' className='form-input' />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePrompt}>
            Cancel
          </Button>
          <Button type='submit' form="create-plan" variant="success" onClick={isOwner ? useRequest : voteRequest}>
            {loading ? "Please wait..." : "Proceed"}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='m-2 p-2 shadow rounded text-start'>
        <div className='d-flex justify-content-between'>
          <div className='w-75'>
            <h3>{reason}</h3>
          </div>
          <div className='display-4 text-success'>
            {voteNumber}
          </div>
        </div>
        <hr />
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
          {parseInt(voters) === 0 ? <div>No contributors yet</div> : <CampaignPrograssBar raisedAmount={votes} target={voters} />}
        </div>
        {toPersonal
        ? (
          <div>
            Requested for Personal use.
          </div>
        )
        :(
          <div>
            Requested for : <Link to={`/agristore/product/${receiver}`}>Product</Link>
          </div>
        )
        }
        <div className='text-center py-3'>
          {!isOwner
            ? <div><Button variant='outline-success' onClick={handlePrompt} value='allow'>Allow</Button>   <Button onClick={handlePrompt} value='dontAllow' variant='outline-danger'>Dont Allow</Button></div>
            : <Button onClick={handlePrompt} variant='danger' disabled={loading}>{loading ? "Please wait..." : "Use Request"}</Button>
          }
        </div>
      </div>
    </div>
  )
}
function SelectFromCartOptions({ setProd, product, hide }) {
  function changeSelectId() {
    setProd(product)
    hide()
  }
  return (
    <div onClick={changeSelectId} value={product.id} className='row align-items-center p-0 border rounded custom-Options'>
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
function CreateRequestModal({ show, handleShow, vid }) {

  const productSelect = {
    title: '<--Select-->',
    imgUrl: '',
    _id: 'select',
    price: ''
  }
  const productPersonal = {
    title: 'Personal Wallet',
    imgUrl: '',
    _id: 'personalUse',
    price: ''
  }
  const [loading, setLoading] = useState(false)
  const reason = useInput('text', 'Tell them what you want')
  const amount = useInput('number', 'How much?')
  const password = useInput('password', 'enter password to confirm')
  const [dropdown, setDropdown] = useState(false)
  const [receiverProduct, setReceiverProduct] = useState(productSelect)
  const { cart } = useContext(StoreContext)
  const urlParams = useParams();

  function handleDropdown() {
    setDropdown(!dropdown)
  }

  function closeModal() {
    setDropdown(false)
    handleShow()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (receiverProduct._id === 'select') {
      alert("select something from the dropdown")
      return
    }
    const dataToSend = {
      reason: reason.value,
      password: password.value,
      receiverProduct: receiverProduct._id,
      amount: amount.value ? amount.value : 'GetFromProduct',
      campaignId: urlParams.id
    }
    setLoading(true)
    const res = await createVoteReq(dataToSend)
    console.log(res);
    if (res.error) {
      toast.error(res.status + " " + res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setLoading(false)
  }

  return (
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
                    {cart.length > 0 ?
                      (
                        cart.map(({ product }, i) => {
                          return <SelectFromCartOptions
                            key={'cartSelectKey' + i}
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
                      product={productPersonal} />
                  </div>
                )}
              </div>
            </fieldset>
            {receiverProduct._id === 'personalUse'
              && (
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
            <Button className='my-3' type='submit' variant="warning" disabled={loading}>{loading ? "Creating..." : "Create Request"}</Button>
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
function Transaction({ sno, receiverId, createdAt, amount, txHash }) {
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
///


export default function CampaignDetails() {

  const [activeCampaign, changeActiveCampaign] = useState(null)
  const { userData, loadingUser, getUserData } = useUser()
  const [show, setShow] = useState(false);
  const params = useParams()
  //REFERENCES
  
  const CreatorDetailsID = useRef()
  const CampaignDescriptionID = useRef()
  const CampaignPledgesAndPromisesIDs = useRef()
  const CampaignInfoID = useRef()
  const CampaignPlanDetailsID = useRef()
  const CampaignVotesinfoID = useRef()

  const refSForNav={
    details:CreatorDetailsID,
    description:CampaignDescriptionID,
    pledges:CampaignPledgesAndPromisesIDs,
    info:CampaignInfoID,
    plans:CampaignPlanDetailsID,
    votes:CampaignVotesinfoID

  }
  //REFERENCES

  function handleShow() {
    setShow(!show)
  }
  async function getCampaignData(id){
    const resdata = await getCampbyId(id)
    changeActiveCampaign(resdata)
  }

  useEffect(() => {
    if (loadingUser || !userData) {
      getUserData()
    }
    if (!activeCampaign) {
      getCampaignData(params.id)
    }
  }, [])


  if (!activeCampaign || !userData || loadingUser) {
    return (
      <div style={{height:'90vh'}} className='d-flex justify-content-center align-items-center'>
        <Loader height='150px' width='150px' />
      </div>
      )
  }
  const contributeModalData = {
    show,
    handleShow,
    cid: activeCampaign._id,
    minContri: activeCampaign.minContri
  }
  const isOwner = userData._id === activeCampaign.manager._id

  console.log("Active Campaign--->",activeCampaign)


  const valuesForCampaignVotesInfo= {
    isOwner:isOwner, 
    userId : userData._id,
    _id:activeCampaign._id,
    contributors:activeCampaign.contributors,
    voteRequests:activeCampaign.voteRequests
  }

  return (
    <div className='container py-4'>
      <div className='CampaignDetailsPageContainer shadow'>
        <CreatorDetails refPass={CreatorDetailsID} {...activeCampaign.manager} isOwner={isOwner} openModal={handleShow} />
        <CampaignInfo refPass={CampaignInfoID} {...activeCampaign} />
        <CampaignDescription refPass={CampaignDescriptionID} description={activeCampaign.description} />
        <CampaignPledgesAndPromises refPass={CampaignPledgesAndPromisesIDs} />
        <CampaignPlanDetails refPass={CampaignPlanDetailsID} {...activeCampaign.associatedPlan}/>
        <CampaignVotesinfo refPass={CampaignVotesinfoID} {...valuesForCampaignVotesInfo} />
        {(activeCampaign.campaignTransactions && isOwner)? <TransactionsHistory tx={activeCampaign.campaignTransactions} />:<div></div>}
        <CampaignNavigation refs={refSForNav} title={activeCampaign.title} />
        <ContributeModal {...contributeModalData} />
      </div>
    </div>
  )
}
