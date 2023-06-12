/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import './Widgets.css'
import { getCollectonCampbyId } from '../../interceptors/serverAPIs';
import CampaignContext from '../../context/CampaignContext';
import { useUser } from '../../context/UserContext';
import ManagementContext from '../../context/ManagementContext';
import Table from 'react-bootstrap/esm/Table';
import { Link, useNavigate } from 'react-router-dom';
import { getTransactions } from '../../interceptors/web3ServerApi';
import AlreadyContributed from '../../assets/icons/tick-box.svg'
import FontAwesome from 'react-fontawesome';
//Charts
import { AxisOptions, Chart } from "react-charts";

//Widget renderer
export function renderWidget(id, props) {
    switch (id) {
        case "current-campaign":
            return <CampaignWidget {...props} />
        case "current-inventory":
            return <InventoryWidget {...props} />
        case "current-pipeline":
            return <PipelineWidget {...props} />
        case "transaction-history":
            return <TransactionHistory {...props} />
        case "contribution-history":
            return <ContributionHistory {...props} />
        case "current-order":
            return <CurrentOrder {...props} />
        case "order-history":
            return <OrderHistory {...props} />
        case "current-plan":
            return <CurrentPlan {...props} />
        case "msp":
            return <MSPChart {...props} />
        default:
            return <></>
    }
}

export function CampaignWidget({ title, target, contributors, _id, ...props }) {
    const numberOfContributors = contributors?.length
    const [collection, setCollection] = useState(0)
    const { currentUser } = useUser()

    useEffect(() => {
        console.log("getting CampLength")
        if (_id)
            getCollectonCampbyId(_id).then((res) => {
                setCollection(res.raisedAmount)
            }).catch((err) => alert(err.message))
    }, [_id])


    return (
        <div className='widget-container'>

            {(title && target && contributors && _id) ?
                <>
                    {
                        contributors.find(contributor => contributor.userId === currentUser) &&
                        <div className='ContributionTick'>
                            <FontAwesome className='text-light' size='2x' name="check" />
                        </div>}
                    <h3 className='container'>
                        {title}
                    </h3>
                    <h4>Campaign Progress</h4>
                    <hr />
                    <div className="campaign-progress">
                        <div className="progress neumorphInto" style={{ height: "30px" }}>
                            <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                                aria-valuenow={`${parseInt((collection / target) * 100)}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((collection / target) * 100)}%` }}>
                                {`${parseInt((collection / target) * 100)}%`}
                            </div>
                        </div>
                        <span className="subtext">
                            {new Intl.NumberFormat("en-IN").format(collection)} KCO of {new Intl.NumberFormat("en-IN").format(target)} KCO raised
                        </span>
                    </div>
                    <div className="current-campaign-widget-details">
                        <div className="contributions">
                            <span className="quantity">{numberOfContributors > 1000 ? `${numberOfContributors / 1000}k+` : numberOfContributors}</span><br />
                            <span className="subtext">contributors</span>
                        </div>
                        <div className="time-remaining">
                            <span className="quantity">{parseInt(((props.deadline * 1000) - Date.now()) / (1000 * 60 * 60 * 24))}d</span><br />
                            <span className="subtext">remaining</span>
                        </div>
                    </div>
                    <div className="widget-action-center d-flex justify-content-around mt-3">
                        <Link to={'/detailedCampaign/' + _id} variant='outline-success' >Details</Link>
                        {props.children}
                    </div>
                </>
                :
                <h4>
                    No campaigns yet.
                </h4>
            }

        </div>
    )
}

export function InventoryWidget(props) {

    const { currentUser, userData, getUserData } = useUser()
    const { inventory, inventoryTotal, INR, getUserInventory } = useContext(ManagementContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userData) getUserData()
        if (!inventory) getUserInventory()
    }, [currentUser])

    return (
        <div className='widget-container'>
            <h4>Current Inventory</h4>
            <hr hidden={inventory && inventory.length > 3} className="style-two" />
            {
                inventory && inventory.length > 0 ?
                    <Table striped bordered className='rounded'>
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>Item</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inventory.map((item, idx) => {
                                    if (idx < 3)
                                        return (
                                            <tr key={idx}>
                                                <td>{item.quantity}</td>
                                                <td>{item.item}</td>
                                                <td>{INR.format(item.estCost)}</td>
                                            </tr>
                                        )
                                })
                            }
                            <tr hidden={inventory.length <= 3}><td></td><td></td><td onClick={() => navigate("/management/inventory")} style={{ cursor: "pointer" }}>+ {inventory.length - 3} more</td></tr>
                            <tr><th colSpan={2}>Total</th><td>{INR.format(inventoryTotal)}</td></tr>
                        </tbody>
                    </Table>
                    :
                    <>
                        <hr className="style-two" />
                        No inventory added yet.
                    </>
            }
        </div>
    )
}

export function PipelineWidget(props) {
    const { currentUser, userData, getUserData } = useUser()

    useEffect(() => {
        if (!userData) getUserData()
    }, [currentUser])

    return (
        <div className='widget-container d-flex flex-column justify-content-start'>
            <h4>Crops Sown</h4>
            <hr className="style-two" />
            <div className="list list-group">
                {
                    userData && userData.currentPlan?.requirements?.map((item, i) => {
                        if (item.category === 'crop') {
                            return (
                                <div key={'PiplineWigetRenderItem' + i} className="list-group-item">
                                    {item.item}<br />
                                    <span className="subtext">Quantity: {item.quantity}</span>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export function EachHistory({ sno, receiverId, userId, amount }) {

    const recivedPaid = receiverId === userId
    return (
        <>
            <tr>
                <td>{sno}</td>
                <td>{receiverId}</td>
                <td className={`text-${userId && (recivedPaid ? 'success' : 'danger')}`}
                >{userId && (recivedPaid ? '+' : '-')}{amount}</td>
            </tr>
        </>
    )
}

export function TransactionHistory(props) {
    const [tx, setTx] = useState([])
    const [txLen, setTxLen] = useState(0)
    const { currentUser } = useUser()
    useEffect(() => {
        getTransactions().then(e => {
            setTxLen(e.wallet.length)
            if (e.wallet.length > 3) {
                setTx(e.wallet.reverse().slice(0, 3))
            } else {
                setTx(e.wallet.reverse())
            }
        })
    }, [])
    return (
        <div className='p-2 widget-container'>
            <h4>
                Transaction History
            </h4>
            <hr className='style-two' />
            <div className='table-responsive'>
                <Table className='w-100' striped bordered>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>To/From</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUser && tx.length ? tx.map((e, i) => i <= 3 && <EachHistory userId={currentUser} key={'transactionHashKey' + i} sno={i + 1} {...e} />)
                            : <tr><td colSpan='5'>No transactions yet</td></tr>}
                        <tr hidden={txLen <= 3} >
                            <td colSpan={3} className='text-end'>
                                ...more
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}


export function EachHistoryContri({ sno, receiverId, amount }) {
    const { changeActiveCampaign } = useContext(CampaignContext)
    function checkCampaign() {
        changeActiveCampaign(receiverId)
    }
    return (
        <>
            <tr>
                <td>{sno}</td>
                <td><span onClick={checkCampaign} className='Camplink'>{receiverId}</span></td>
                <td>{amount}</td>
            </tr>
        </>
    )
}

export function ContributionHistory(props) {
    const [tx, setTx] = useState([])
    const [txLen, setTxLen] = useState(0)
    const { currentUser } = useUser()
    useEffect(() => {
        getTransactions().then(e => {
            setTxLen(e.camp?.length)
            if (e.camp?.length > 3) {
                setTx(e.camp.reverse().slice(0, 3))
            } else {
                setTx(e.camp?.reverse())
            }
        })
    }, [])
    return (
        <div className='p-2 widget-container'>
            <h4>
                Contribution History
            </h4>
            <hr className='style-two' />
            <div className='table-responsive'>
                <Table className='w-100' striped bordered>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>To/From</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUser && tx?.length ? tx.map((e, i) => i <= 3 && <EachHistoryContri key={'transactionHashKey' + i} sno={i + 1} {...e} />)
                            : <tr><td colSpan='5'>No Contributions yet</td></tr>}
                        <tr hidden={!txLen || txLen <= 3} >
                            <td colSpan={3} className='text-end'>
                                <Link to='/wallet'>
                                    ...more
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
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

export function CurrentPlan(props) {
    const { currentUser, userData, getUserData } = useUser()
    const [percentage, setPercentage] = useState(0)
    const [crops, setCrops] = useState(0)
    const [supplements, setSupplements] = useState(0)

    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    })

    useEffect(() => {
        if (!userData) getUserData()
        else {
            if (userData.currentPlan) {
                setPercentage((new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart)))
                userData.currentPlan.requirements.forEach((item) => {
                    if (item.category == 'crop') setCrops((prev) => prev + 1)
                    else setSupplements((prev) => prev + 1)
                })
            }
        }
    }, [currentUser])

    return (
        <div className='widget-container '>
            <div className="">
                <h4>Current Plan</h4>
                <hr className="style-two" />
            </div>
            {userData && userData.currentPlan &&
                <>
                    <div className="campaign-progress">
                        <span>{percentage < 1 ? "Just Started!" : ""}</span>
                        <div className="progress" style={{ height: "30px" }}>
                            <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                                aria-valuenow={`${(new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart))}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${(new Date() - new Date(userData?.currentPlan.executionStart)) * 100 / (new Date(userData?.currentPlan.executionEnd) - new Date(userData?.currentPlan.executionStart))}%` }}>
                                <span>{parseInt(percentage)}%</span>
                            </div>
                        </div>
                        <div className="current-campaign-widget-details mt-2">
                            <div className="contributions col">
                                <span className="quantity">{INR.format(userData?.currentPlan.estCost)}</span><br />
                                <span className="subtext">cost</span>
                            </div>
                            <div className="time-remaining col">
                                <span className="quantity">{INR.format(userData?.currentPlan.estRevenue)}</span><br />
                                <span className="subtext">revenue</span>
                            </div>
                        </div>
                        <div className="current-campaign-widget-details">
                            <div className="contributions col">
                                <span className="quantity">{crops}</span><br />
                                <span className="subtext">crops</span>
                            </div>
                            <div className="time-remaining col">
                                <span className="quantity">{supplements}</span><br />
                                <span className="subtext">supplements</span>
                            </div>
                        </div>
                    </div>
                    <span className="subtext mt-2">
                        Expected {userData?.currentPlan.estRevenue - userData?.currentPlan.estCost > 0 ? "Profit" : "Loss"}: <b>{INR.format(Math.abs(userData?.currentPlan.estRevenue - userData?.currentPlan.estCost))}</b>
                    </span>
                </>
            }
        </div>
    )
}


// function ResizableBox({
//     children,
//     width = 600,
//     height = 300,
//     resizable = true,
//     style = {},
//     className = "",
// }) {
//     return (
//         <div style={{ marginLeft: 20 }}>
//             <div
//                 style={{
//                     display: "inline-block",
//                     width: "auto",
//                     background: "white",
//                     padding: ".5rem",
//                     borderRadius: "0.5rem",
//                     boxShadow: "0 30px 40px rgba(0,0,0,.1)",
//                     ...style,
//                 }}
//             >
//                 {resizable ? (
//                     <ReactResizableBox width={width} height={height}>
//                         <div
//                             style={{
//                                 width: "100%",
//                                 height: "100%",
//                             }}
//                             className={className}
//                         >
//                             {children}
//                         </div>
//                     </ReactResizableBox>
//                 ) : (
//                     <div
//                         style={{
//                             width: `${width}px`,
//                             height: `${height}px`,
//                         }}
//                         className={className}
//                     >
//                         {children}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


export function MSPChart() {
    const [lineData, setLineData] = useState([
        {
            label: 'MSP',
            data: [{
                year: 2010,
                msp: 1000
            },
            {
                year: 2011,
                msp: 1080
            },
            {
                year: 2012,
                msp: 1250
            },
            {
                year: 2013,
                msp: 1310
            },
            {
                year: 2014,
                msp: 1360
            },
            {
                year: 2015,
                msp: 1410
            },
            {
                year: 2016,
                msp: 1470
            },
            {
                year: 2017,
                msp: 1550
            },
            {
                year: 2018,
                msp: 1750
            },
            {
                year: 2019,
                msp: 1815
            },
            {
                year: 2020,
                msp: 1868
            },
            {
                year: 2021,
                msp: 1940
            },
            {
                year: 2022,
                msp: 2040
            }]
        }
    ])
    const [barData, setBarData] = useState([
        {
            label: "MSP",
            data: [{
                year: "2010-11",
                msp: 1000
            },
            {
                year: "2011-12",
                msp: 1080
            },
            {
                year: "2012-13",
                msp: 1250
            },
            {
                year: "2013-14",
                msp: 1310
            },
            {
                year: "2014-15",
                msp: 1360
            },
            {
                year: "2015-16",
                msp: 1410
            },
            {
                year: "2016-17",
                msp: 1470
            },
            {
                year: "2017-18",
                msp: 1550
            },
            {
                year: "2018-19",
                msp: 1750
            },
            {
                year: "2019-20",
                msp: 1815
            },
            {
                year: "2020-21",
                msp: 1868
            },
            {
                year: "2021-22",
                msp: 1940
            },
            {
                year: "2022-23",
                msp: 2040
            }]
        }
    ])
    const primaryAxis = React.useMemo(
        () => ({
            getValue: (datum) => datum.year,
        }),
        []
    );

    const secondaryAxes = React.useMemo(
        () => [
            {
                getValue: (datum) => datum.msp,
            },
        ],
        []
    );

    const [chosenFormat, setChosenFormat] = useState(barData)

    return (
        <>
            <div className='d-flex flex-column p-1 h-100'>
                <div className="d-flex justify-content-center">
                    Select Chart Type: &nbsp;
                    <select onChange={(e) => {
                        if (e.target.value === "line") setChosenFormat(lineData)
                        else setChosenFormat(barData)
                    }}>
                        <option value="line">Line</option>
                        <option value="bar" selected>Bar</option>
                    </select>
                </div>
                <div className="w-100" style={{ height: "90%" }}>
                    <Chart
                        options={{
                            data: chosenFormat,
                            primaryAxis,
                            secondaryAxes,
                        }}
                    />
                </div>
            </div>
        </>
    )
}