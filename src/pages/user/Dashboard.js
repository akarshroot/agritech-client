import React, { useEffect, useState } from 'react'
import { CampaignWidget, renderWidget } from '../../assets/widgets/Widgets'
import { useUser } from '../../context/UserContext'
import './Dashboard.css'

function Dashboard() {

    const { currentUser, userData, theme, loading, getUserData, getUserCampaigns, userCampaigns } = useUser()
    const [campaignWidget, setCampaignWidget] = useState({})
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
    }, [currentUser])

    return (
        <>
            <div className={`dashboard-container theme-${theme}`}>
                <div className={`col-2 d-none d-md-block profile-section theme-${theme}`}>
                    <div className="profile-image-container">
                        <img src={userData?.imgUrl} alt={userData?.name} />
                        <div className="details-section-element"><h3 className="display-name">{userData?.name}</h3></div>
                        <hr className="style-two" />
                    </div>
                    <div className="member-details-section">
                        <div className="details-section-element">Region: <span className="region">{userData?.region}</span></div>
                        <div className="details-section-element">Land Area: <span className="land-area">{userData?.landArea}</span></div>
                        <div className="details-section-element">Crop: <span className="prefered-crop">{userData?.crop}</span></div>
                    </div>
                </div>
                <div className="col widgets-section">
                    {
                        widgets.map((widget, key) => {
                            return (
                                <div className={`widget ${loading ? "skeleton-widget" : ""}`} key={key}>
                                    {
                                        loading ? <></> :
                                            <>
                                                {renderWidget(widget.id, widget.data)}
                                            </>
                                    }
                                </div>
                            )
                        })
                    }
                    <div className="widget">
                        <CampaignWidget _id={campaignWidget?._id} contributors={campaignWidget?.contributors} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard