import React, {useContext, useState} from 'react'
import CampaignContext from '../../../context/CampaignContext'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import useInput from '../../../hooks/useInput'
import {Link, Navigate} from 'react-router-dom'
import {useUser} from '../../../context/UserContext'
import {ContributeModal} from '../Campaigns'
import {createVoteReq, useReq, voteForReq} from '../../../interceptors/web3ServerApi'


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
            <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" 
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


function WithdrawRequests({cid,reason,amount,votes,voters,receiver,isOwner,voteNumber,contributors}){
  console.log(contributors)
  async function useRequest(){
    const password = await prompt('Enter Password to confirm')
    const dataToSend = {
      voteNumber,
      password,
      cid
    }
    console.log(dataToSend)
    const res = await useReq(dataToSend)
    alert(res.message)
  }
  async function voteRequest(e){
    const password = await prompt('enter Password to Confirm')
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
        <h3>{reason}</h3>
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
          Requested for : <Link to={`/productDetails/${receiver}`}>Product</Link>
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

function CreateRequestModal({show, handleShow, vid}){

  const reason = useInput('text','Tell them what you want')
  const amount = useInput('number','How much?')
  const password = useInput('password','enter password to confirm')
  const [receiverId,setreceiverId] = useState('')
  const {activeCampaign} = useContext(CampaignContext)

  function handleOnChangereceiverId(e){
    console.log(e.target.value)
    if(e.target.value !== 'Personaluse'){
      amount.onChange(0)
    }
    setreceiverId(e.target.value)
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(receiverId==='select'){
      alert("select something from the dropdown")
      return
    }
    const dataToSend = {
      reason:reason.value,
      password:password.value,
      receiverProduct:receiverId,
      amount: amount.value? amount.value:'GetFromProduct',
      campaignId: activeCampaign._id
    }
    const res = await createVoteReq(dataToSend)
    alert(res.message)
  }


  return(
    <Modal
      show={show}
      onHide={handleShow}
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
              <label htmlFor={'voteCampreceiver' + vid}>Where to send to</label><br />
              <select onChange={handleOnChangereceiverId} value={receiverId} required className='form-control' name='receiver' id={'voteCampreceiver' + vid}>
                <option value={'select'}>select</option>
                <option value={'643012889eb15a43565a1d11'}>Item1</option>
                <option value={'643013419eb15a43565a1d12'}>Item2</option>
                <option value={'64301d589eb15a43565a1d13'}>Item3</option>
                <option value={'Personaluse'} >Personal Wallet</option>
              </select>
            </fieldset>
            {receiverId === 'Personaluse'
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
        <Button variant="secondary" onClick={handleShow}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
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
                  <WithdrawRequests isOwner={isOwner} key={'votesContainerKey'+i} cid={activeCampaign._id} voters={activeCampaign.contributors.length} {...data}/>
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
  
  const {activeCampaign} = useContext(CampaignContext)
  const {userData} = useUser()
  const [show,setShow] = useState(false);
  function handleShow(){
    setShow(!show)
  }
  if(!activeCampaign){
    return <Navigate to='/campaigns' replace />
  }
  const contributeModalData={
    show,
    handleShow,
    cid:activeCampaign._id,
    minContri:activeCampaign.minContri
  }
  const isOwner =  userData._id===activeCampaign.manager._id
  return (
    <div className='container py-2'>
        <CreatorDetails {...activeCampaign.manager} isOwner={isOwner} openModal={handleShow} />
        <CampaignInfo {...activeCampaign} />
        <CampaignVotesinfo isOwner={isOwner} />
        <ContributeModal {...contributeModalData} />
    </div>
  )
}
