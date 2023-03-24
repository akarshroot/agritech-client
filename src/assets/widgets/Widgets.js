import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Widgets.css'

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

export function CampaignWidget(props) {
    const [currentCampaign, setCampaign] = useState({
        collection: 20000,
        target: 100000,
        contributions: 10000,
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
    }, [currentCampaign])


    return (
        <div className='widget-container'>
            <h4>Current Campaign Progress</h4>
            <div className="error-message" hidden={!error}>{error}</div>
            <div className="campaign-progress">
                <div className="progress" style={{ height: "30px" }}>
                    <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                        aria-valuenow={`${parseInt((currentCampaign.collection / currentCampaign.target) * 100)}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((currentCampaign.collection / currentCampaign.target) * 100)}%` }}>
                        {`${parseInt((currentCampaign.collection / currentCampaign.target) * 100)}%`}
                    </div>
                </div>
                <span className="subtext">
                    ₹{new Intl.NumberFormat("en-IN").format(currentCampaign.collection)} of ₹{new Intl.NumberFormat("en-IN").format(currentCampaign.target)} raised
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
            <div className="widget-action-center">
                <Link to="/campaigns"><button className="button-28">Details</button></Link>
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
