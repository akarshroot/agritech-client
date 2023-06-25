import React, { useEffect, useState } from 'react'
import { CampaignWidget, renderWidget } from '../../assets/widgets/Widgets'
import { useUser } from '../../context/UserContext'
import './Dashboard.css'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router'
import Button from 'react-bootstrap/Button'
import { Steps, Hints } from "intro.js-react";
import "intro.js/introjs.css";


function Dashboard() {
    const navigate = useNavigate()
    const { currentUser, userData, theme, loading, getUserData, getUserCampaigns, userCampaigns } = useUser()

    //Intro States
    const [stepsEnabled, setStepsEnabled] = useState(sessionStorage.getItem('demo-completed') === "true" ? false : true)
    const [initialStep] = useState(0)
    const [steps] = useState([
        {
            element: ".welcome-user-intro",
            intro: "Welcome User!"
        },
        {
            element: ".navigation-links-intro",
            intro: "This navigation bar will help you go from one section to another within the AgriTech console."
        },
        {
            element: ".profile-btn-intro",
            intro: "Use this button to visit your profile."
        },
        {
            element: ".all-widgets-container",
            intro: "These are 'widgets' to help you see your actions on the platform."
        },
        {
            element: ".balance-widget-intro",
            intro: "This widget tracks your Kissan Coin balance."
        },
        {
            element: ".balance-widget-amount-intro",
            intro: "This is the total amount of KCOs available for use on the platform."
        },
        {
            element: ".balance-widget-chart-intro",
            intro: "This graph shows the change in wallet balance with time. Hover over the highlighted points to see the transaction date. This helps you track any unusual activity at a glance."
        },
        {
            element: ".current-inventory-intro",
            intro: "This widget tracks your inventory items and total inventory cost. Inventory can be managed under the <i>'Management'</i> section."
        },
        {
            element: ".current-pipeline-intro",
            intro: "This widget tracks your currently sown crops if any plan is currently in execution."
        },
        {
            element: ".transaction-history-intro",
            intro: "Use this widget to view a brief summary of recent transactions."
        },
        {
            element: ".contribution-history-intro",
            intro: "Use this widget to view a brief summary of recent contributions in different campaigns."
        },
        {
            element: ".recent-campaign-intro",
            intro: "This widget contains information about your most recent campaign."
        },
        {
            element: ".translate-intro",
            intro: "Use this button to translate the AgriTech console in your prefered language."
        },
        {
            element: ".logout-intro",
            intro: "Use this button to Logout from the AgriTech console."
        },
        {
            element: "iframe#chatbot-chat-frame",
            intro: "This is the AgriHelp chatbot. Use this to get help from a AgriTech Customer Executive."
        },
        {
            element: ".replay-demo-intro",
            intro: "To replay this demo anytime, just click this button"
        }
    ])
    const [hints] = useState([
        {
            element: ".hello",
            hint: "Hello hint",
            hintPosition: "middle-right"
        }
    ])
    const [hintsEnabled] = useState(true)

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
        }
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
            <Helmet>
                <title>Dashboard | AgriTech</title>
            </Helmet>
            <Steps
                enabled={stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={() => {
                    setStepsEnabled(false)
                    sessionStorage.setItem('demo-completed', "true")
                }}
            />
            <Hints enabled={hintsEnabled} hints={hints} />

            <div className={`dashboard-container px-3 theme-${theme}`}>
                <div className='welcome-user w-100 justify-content-between d-flex'>
                    <h2 className='welcome-user-intro'>Welcome, {userData?.name}! </h2>
                    <div>
                        <Button className='profile-btn-intro m-2' onClick={() => navigate("/profile")}>Go to profile</Button>
                        <Button className='replay-demo-intro m-2' onClick={() => setStepsEnabled(true)}>Enable Demo</Button>
                    </div>
                </div>
                <div className="all-widgets-container row">
                    <div className='col-md-6 col-lg-8 col-xl-4 p-3 balance-widget-intro'>
                        <div className="widget balance-widget">
                            {renderWidget('wallet-balance')}
                        </div>
                    </div>

                    {
                        widgets.map((widget, key) => {
                            return (
                                <div key={"DASHBOARD_WIDGETS_" + key} className={`col-md-6 col-lg-4 col-xl-4 p-3 ${widget.id}-intro`}>
                                    <div className={`widget ${loading ? "skeleton-widget" : ""}`} >
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
                    <div className="col-md-4 col-xl-4 p-3 recent-campaign-intro">
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