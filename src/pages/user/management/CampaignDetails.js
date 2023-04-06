import React, {useContext} from 'react'
import CampaignContext from '../../../context/CampaignContext'
import Table from 'react-bootstrap/Table'
import {Navigate} from 'react-router-dom'

function CreatorDetails({imgUrl,name,email,walletAddress}){
  return(
    <div className='row shadow p-3 rounded'>
      <div className='col-md-4'>
        <img height='156px' width='156px' className='rounded-circle' src={imgUrl} alt='User profile Img here'/>
      </div>
      <div className='col-md-8'>
        <legend>Creator</legend>
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

function CampaignVotesinfo(){}

export default function CampaignDetails() {
  
  const {activeCampaign} = useContext(CampaignContext)
  if(!activeCampaign){
    return <Navigate to='/campaigns' replace />
  }
  return (
    <div className='container py-2'>
        <CreatorDetails {...activeCampaign.manager}/>
        <CampaignInfo {...activeCampaign} />
    </div>
  )
}
