import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { getAllCamps } from '../../interceptors/serverAPIs'
import { CampaignWidget } from '../../assets/widgets/Widgets';
import Button from 'react-bootstrap/esm/Button';
import { ContributeModal } from './Campaigns';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

function ExploreCampaigns() {
    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([])
    const { userData } = useUser()

    const [showContribute, setShowContribute] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate()

    function handleShow() {
        setShow(!show)
    }

    function handleShowContribute() {
        setShowContribute(!showContribute)
    }


    useEffect(() => {
        if (campaigns.length === 0) {
            getAllCamps().then((res) => {
                console.log(res)
                setCampaigns(res)
            })
        }
    }, [])


    return (
        <div className='container'>
            <div className="header d-flex justify-content-around align-items-center">
                <Button className='h-25' onClick={() => { navigate("/campaigns",{replace:true}) }} variant='warning'>&larr;&nbsp; Go Back</Button>
                <h2 className='display-6'>Explore campaigns across the platform</h2>
                <hr className='style-two' />
            </div>
            <div className='row'>
                {loading ? <>Loading...</>
                    :
                    campaigns?.map((data, i) => {
                        return (
                            <React.Fragment key={'campaignsKey' + i}>
                                <div className='col-sm-6 col-md-4 col-lg-3 p-4'>
                                    <div className='widget'>
                                        <CampaignWidget {...data}>
                                            <Button onClick={handleShowContribute} variant='success'>Contribute</Button>
                                        </CampaignWidget>
                                        <ContributeModal
                                            show={showContribute}
                                            handleShow={handleShowContribute}
                                            cid={data._id}
                                            minContri={data.minContri}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default ExploreCampaigns