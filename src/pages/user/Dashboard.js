import React from 'react'
import { useUser } from '../../context/UserContext'
import './Dashboard.css'

function Dashboard() {

    const { currentUser, userData, theme } = useUser()

    return (
        <>
            <div className={`dashboard-container theme-${theme}`}>
                <div className={`profile-section theme-${theme}`}>
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
                <div className="widgets-section">
                    <div className="widget">
                        Current Campaign Progress
                    </div>
                    <div className="widget">
                        Current Inventory
                    </div>
                    <div className="widget">
                        Crops Sown
                    </div>
                    <div className="widget">
                        Order Details
                        <hr className="style-two" />
                        Order History
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard