import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getAllCamps, getCollectonCampbyId } from '../../interceptors/serverAPIs'
import Button from 'react-bootstrap/esm/Button';
import { ContributeModal } from './Campaigns';
import { useNavigate } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Loader from '../../assets/loader/Loader';
import Table from 'react-bootstrap/Table'
import './Dashboard.css'
import './ExploreCampaigns.css'

function CampaignWidgetV2({ manager,featuredImage, title, target, contributors, _id, minContri,...props}){
    const numberOfContributors = contributors?.length
    const [collection, setCollection] = useState(0)
    const { currentUser } = useUser()

    const [hovering,setHovering] =useState(false)

    useEffect(() => {
        if (_id)
            getCollectonCampbyId(_id).then((res) => {
                setCollection(res.raisedAmount)
            }).catch((err) => alert(err.message))
    }, [_id])

    const navigate = useNavigate()
    function handleClick(){
        navigate('/campaign/details/'+_id)
    }
    const deadline = parseInt(((props.deadline * 1000) - Date.now()) / (1000 * 60 * 60 * 24))

    const cropsArr = props.associatedPlan?.requirements.filter(e => e.category==='crop')
    return (
        <div onClick={handleClick} className='widget-container-campaign-v2 bg-white rounded m-3'>
            
            <div className='d-flex text-start justify-content-between bg-agriGreen p-3'>
                <div><h3>{title}</h3></div>
                <div>Starting at<br/> {minContri} KCO</div>
            </div>
            <div onMouseEnter={()=>{setHovering(true)}} onMouseLeave={()=>{setHovering(false)}} className='widget-container-campaign-v2-body'>
                
                <div>
                    <div className={`CampFeaturedImage`}>
                        <img src={featuredImage} alt=''/>
                    </div>
                    <div className={`campUserProfilePic ${hovering && 'opacity-0'}`}>
                        <img className='shadow' src={manager.imgUrl} alt='Profile Pic here'/>
                    </div>
                    <div className={`campBasicCropDetails shadow ${hovering && 'opacity-0'}`}>
                        <div className='m-2 ps-2 pt-2 text-start'><h5>Crops Plan</h5></div>
                        <hr className='bg-light'/>
                        <Table className='text-light text-start ms-5'>
                            <tbody>
                                {cropsArr.map((e,i) => {
                                    return(
                                        <tr key={'EachCropForCamp'+i+'For'+_id}>
                                            <td>
                                                {e.item}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>


                <div className={` ${deadline<=0?'CampDetailsDead':''} CampDetails`}>
                    <div className='CampUserDetails'>
                        <h2>
                            By {manager.name}
                        </h2>
                        {manager.email}
                    </div>
                    <div className='campContributionStatus '>
                        {contributors.find(contributor => contributor.userId === currentUser)
                        ?(<div className='ContributionTick'>
                            <FontAwesome className='text-success' size='4x' name="check"/>
                        </div>)
                        :(<div>
                            Click for more
                        </div>)
                        }
                    </div>
                    <div className='CampStatsBasic'>
                        <div className="campaign-progress m-3">
                            <span className="subtext">
                                {new Intl.NumberFormat("en-IN").format(collection)} KCO of {new Intl.NumberFormat("en-IN").format(target)} KCO raised
                            </span>

                            <div className="customBar m-1" style={{ height: "30px" }}>
                                <div className="progress-bar bg-opacity-10 progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                                    aria-valuenow={parseInt((collection / target) * 100)} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((collection / target) * 100)}%` }}>
                                    {`${parseInt((collection / target) * 100)}%`}
                                </div>
                            </div>

                        </div>
                        
                        <div className="current-campaign-widget-details">
                            <div className="contributions">
                                <span className="quantity">{numberOfContributors > 1000 ? `${numberOfContributors / 1000}k+` : numberOfContributors}</span><br />
                                <span className="subtext">contributors</span>
                            </div>
                            <div className="time-remaining">
                                <span className="quantity">{deadline>0? (deadline+"d"):<span className='text-danger' ><b>Expired</b></span>}</span><br />
                                <span className="subtext">remaining</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ExploreCampaigns() {
    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([])
    const [showContribute, setShowContribute] = useState(false);
    const navigate = useNavigate()

    function handleShowContribute() {
        setShowContribute(!showContribute)
    }


    useEffect(() => {
        if (campaigns.length === 0) {
            setLoading(true)
            getAllCamps().then((res) => {
                console.log(res)
                setCampaigns(res)
                setLoading(false)
            })
        }
    }, [])


    return (
        <div className='container'>
            <div className="header d-flex justify-content-around align-items-center">
                <Button className='h-25' onClick={() => { navigate("/campaigns", { replace: true }) }} variant='warning'>&larr;&nbsp; Go Back</Button>
                <h2 className='display-6'>Explore campaigns across the platform</h2>
                <hr className='style-two' />
            </div>
            <hr />
            <div className='row'>
                {
                    campaigns?.length === 0 && <div className='text-center m-3'>No campaigns created yet.</div>
                }
                {loading 
                ? (<div style={{height:'80vh'}} className='d-flex justify-content-center align-content-center'>
                    <Loader height='200px' width='200px' />
                </div>)
                :campaigns?.map((data, i) => {
                        return (
                            <div key={'campaignsKey' + i} className='col-md-6 p-3'>
                                <CampaignWidgetV2 {...data}/>
                                <ContributeModal
                                    show={showContribute}
                                    handleShow={handleShowContribute}
                                    cid={data._id}
                                    minContri={data.minContri}
                                />
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default ExploreCampaigns