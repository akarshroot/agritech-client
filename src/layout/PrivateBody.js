import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import FontAwesome from 'react-fontawesome'
import './PrivateNav.css'
import Button from 'react-bootstrap/Button'
import dashboard from '../assets/icons/dashboard.png'
import wallet from '../assets/icons/wallet.png'
import management from '../assets/icons/management.png'
import campaigns from '../assets/icons/campaigns.png'
import agristore from '../assets/icons/agristore.png'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ToastContainer, toast } from 'react-toastify'

function PrivateNav(props) {
    const { currentUser, logout, loading, userData, getUserData } = useUser()
    const [tab, setTab] = useState(window.location.pathname.split("/")[1])
    const [hamShow, setHamShow] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setTab(window.location.pathname.split("/")[1])
        return () => {
            setTab("dashboard")
        }
    }, [window.location.pathname, currentUser, loading])

    useEffect(() => {
        if (!userData) getUserData()
    }, [])


    return (
        <>
            <div className={`private-nav d-none d-md-block theme-${props.theme}`}>
                <div className='logoConsole'>
                    <div onClick={() => navigate('/', { replace: true })} className='logoLink'>
                        AgriTech Console
                    </div>
                    {userData?.admin && < Button variant='success' className='admin-btn' onClick={() => navigate("/admin/panel")}>Admin Panel</Button>}
                </div>
                {/* <div className='d-flex justify-content-between pt-1'> */}
                <div className='links-container d-flex justify-content-between flex-wrap'>
                    {/* <div className='d-flex'> */}
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}><img src={dashboard} height={45} width={45} />Dashboard</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}><img src={wallet} height={45} width={45} />Wallet</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}><img src={management} height={45} width={45} />Management</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}><img src={campaigns} height={45} width={45} />Campaigns</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}><img src={agristore} height={45} width={45} />AgriStore</li></Link>
                    {/* </div> */}
                    <div className='p-1'>
                        <Button variant='btn bg-warning bg-opacity-75 mx-3' onClick={() => logout()}>LOGOUT</Button>
                    </div>
                </div>
            </div >

            <div className={`private-nav d-block d-md-none theme-${props.theme}`}>
                <div className='display-5 logoConsole'>AgriTech Console</div>
                <div className='hamButtonNav'>
                    <FontAwesome name='bars' onClick={() => setHamShow(!hamShow)} className="fa-solid fa-bars" />
                    {userData?.admin && < Button variant='success' className='admin-btn' onClick={() => navigate("/admin/panel")}>Admin Panel</Button>}
                    <Button variant='btn bg-warning bg-opacity-75' onClick={() => logout()}>LOGOUT</Button>
                </div>
                <div className={`dropDownNav ${hamShow ? 'showDropDownNav' : ''}`}>
                    <ul className='links-container p-0 justify-content-center d-flex flex-column align-items-center'>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                    </ul>
                </div>
            </div>
        </>
    )
}

function PrivateBody(props) {
    const Body = props.body
    const navigate = useNavigate()

    const { currentUser, theme, checkTokenCookie, loading, userData, getUserData, verifyUserEmail } = useUser()

    const [openVerifyModal, setShowVerifyModal] = useState(false)
    const [disableVerify, setDisableVerify] = useState(false)
    const otpRef = useRef()


    function handleVerifyModal() {
        setShowVerifyModal(!openVerifyModal)
    }

    async function verifyOTP(e) {
        e.preventDefault()
        setDisableVerify(true)
        const res = await verifyUserEmail(otpRef.current.value)
        setDisableVerify(false)
        if (res.error === false) {
            toast.success(res.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    useEffect(() => {
        if (!checkTokenCookie && !currentUser) { navigate("/") }
    })

    useEffect(() => {
        if (!userData) getUserData()
    }, [])

    return (
        <>
            {
                loading ?
                    <>Loading...</>
                    :
                    <>
                        <PrivateNav theme={theme} />
                        {userData && userData.verified == false ?
                            <>
                                <Modal
                                    show={openVerifyModal}
                                    onHide={handleVerifyModal}
                                    backdrop="static"
                                    keyboard={false}
                                    size='md'
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Verify Email</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={verifyOTP} className='form-control'>
                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                <p>Enter the 4 digit pin sent to your registered email.</p>
                                                <fieldset className='m-1'>
                                                    <label htmlFor='otp'>OTP</label><br />
                                                    <input id='otp' type='number' ref={otpRef} required={true} />
                                                </fieldset>
                                            </div>
                                            <div className='text-end'>
                                                <Button className='mx-2' variant="danger" onClick={handleVerifyModal}>
                                                    Cancel
                                                </Button>
                                                <Button className='my-3' type='submit' variant="success" disabled={disableVerify} >{disableVerify ? "Verifying..." : "Verify"}</Button>
                                            </div>
                                        </Form>
                                    </Modal.Body>
                                </Modal>

                                <ToastContainer
                                    position="top-right"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss={false}
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                />
                                <div className="verification-bar alert alert-danger p-1">Verify your email to use all features. <a className='link' onClick={handleVerifyModal}>Click here</a>.</div>
                            </>
                            : <></>}

                        <div className="body">
                            <Body theme={theme} />
                        </div>
                    </>
            }
        </>
    )
}

export default PrivateBody