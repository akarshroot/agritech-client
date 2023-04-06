import React, { Children, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Widgets.css'
import {getCollectonCampbyId} from '../../interceptors/serverAPIs';

//Widget renderer
export function renderWidget(id) {
    switch (id) {
        case "current-campaign":
            return <CampaignWidget />
        case "current-inventory":
            return <InventoryWidget />
        case "current-pipeline":
            return <PipelineWidget />
        case "transaction-history":
            return <TransactionHistory />
        case "current-order":
            return <CurrentOrder />
        case "order-history":
            return <OrderHistory />
        default:
            return <></>
    }
}

// address: "0xdd14b2dbf4C9cdB97e8cea3236f4a67039671156"
// deadline: 3600
// manager: "642bc93214d2e343d7e8301b"
// minContri: 100
// target: 10000
// title: "seeds"
// voteRequests: []
// __v: 0
// id:"642e5f4c5625fa8e2396ec90"
// contributors:0

export function CampaignWidget({title,target,contributors,_id,...props}) {
    const [collection, setCollection] = useState(0)
    const [currentCampaign, setCampaign] = useState({
        target,
        contributions: contributors,
        startDate: new Date("03/10/2023"),
        endDate: new Date("03/31/2023")
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { getActiveCampaign } = useUser()

    async function fetchCampaignData() {
        try {
            setError("")
            setLoading(true)
            // await getActiveCampaign()
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCampaignData()
        getCollectonCampbyId(_id).then((res)=>{
            setCollection(res.raisedAmount)
            console.log("raisedAmount->>", res.raisedAmount)
            console.log("currentCampaign->>", currentCampaign)
        })
    }, [])


    return (
        <div className='widget-container shadow rounded'>
            <h3>{title}</h3>
            <h4>Campaign Progress</h4>
            <div className="error-message" hidden={!error}>{error}</div>
            <div className="campaign-progress">
                <div className="progress" style={{ height: "30px" }}>
                    <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                        aria-valuenow={`${parseInt((collection / currentCampaign.target) * 100)}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((collection / currentCampaign.target) * 100)}%` }}>
                        {`${parseInt((collection / currentCampaign.target) * 100)}%`}
                    </div>
                </div>
                <span className="subtext">
                    ₹{new Intl.NumberFormat("en-IN").format(collection)} of ₹{new Intl.NumberFormat("en-IN").format(currentCampaign.target)} raised
                </span>
            </div>
            <div className="current-campaign-widget-details">
                <div className="contributions">
                    <span className="quantity">{currentCampaign.contributions > 1000 ? `${currentCampaign.contributions / 1000}k+` : currentCampaign.contributions}</span><br />
                    <span className="subtext">contributions</span>
                </div>
                <div className="time-remaining">
                    <span className="quantity">{parseInt((currentCampaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d</span><br />
                    <span className="subtext">remaining</span>
                </div>
            </div>
            <div className="widget-action-center d-flex justify-content-around mt-3">
                <Link to="/campaigns"><button className="btn btn-outline-success">Details</button></Link>
                {props.children}
            </div>
        </div>
    )
}

export function InventoryWidget(props) {
    return (
        <div className='widget-container'>
            <h4>Current Inventory</h4>

        </div>
    )
}

export function PipelineWidget(props) {
    return (
        <div className='widget-container'>
            <h4>Crops Sown</h4>

        </div>
    )
}

export function TransactionHistory(props) {
    return (
        <div className='widget-container'>
            <h4>Transaction History</h4>

        </div>
    )
}

export function CurrentOrder(props) {
    return (
        <div className='widget-container'>
            <h4>Order Details</h4>

        </div>
    )
}

export function OrderHistory(props) {
    return (
        <div className='widget-container'>
            <h4>Order History</h4>

        </div>
    )
}
