import React, { useEffect, useState } from 'react'
import { CampaignWidget, renderWidget } from '../../assets/widgets/Widgets'
import { useUser } from '../../context/UserContext'
import './Dashboard.css'

function Dashboard() {

    const { currentUser, userData, theme, loading, getUserData, getUserCampaigns, userCampaigns } = useUser()
    const [campaignWidget, setCampaignWidget] = useState()
    const [widgets, setWidgets] = useState([
        {
            category: "inventory",
            id: "current-inventory"
        },
        {
            title: "Crops Sown",
            id: "current-pipeline"
        },
        {
            title: "Transaction History",
            id: "transaction-history"
        },
        {
            title: "Contribution History",
            id: "contribution-history"
        },
    ])

    useEffect(() => {
        if (!userData) getUserData()
        if (userCampaigns) {
            setCampaignWidget(userCampaigns.reverse()[0])
        }
        else {
            getUserCampaigns()
        }
    }, [currentUser, userCampaigns])

    return (
        <>
            <div className={`dashboard-container px-3 theme-${theme}`}>
                <div className='welcome-user'>
                    <h2>Welcome, {userData?.name}! </h2>
                </div>

                <div className="all-widgets-container row">
                    {
                        widgets.map((widget, key) => {
                            return (
                                <div className='col-md-4 col-xl-3 '>
                                    <div className={`widget  ${loading ? "skeleton-widget" : ""}`} key={"DASHBOARD_WIDGETS_"+key}>
                                        {
                                            loading ? <></> :
                                            <>
                                                    {renderWidget(widget.id, widget.data)}
                                                </>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="col-md-4 col-xl-3 py-4">
                        <div className='widget'>
                            <CampaignWidget title={campaignWidget?.title} target={campaignWidget?.target} _id={campaignWidget?._id} contributors={campaignWidget?.contributors} deadline={campaignWidget?.deadline} dateCreated={campaignWidget?.dateCreated} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard