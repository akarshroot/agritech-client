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
import { Helmet } from 'react-helmet'
import logoHorizontal from '../assets/logo/logoImg.svg'

function PrivateNav(props) {
    const { currentUser, logout, loading, userData, getUserData } = useUser()
    const [tab, setTab] = useState(window.location.pathname.split("/")[1])
    const [hamShow, setHamShow] = useState(false)
    const navigate = useNavigate()
    const [translateActive, setTranslateActive] = useState(false)

    useEffect(() => {
        setTab(window.location.pathname.split("/")[1])
        return () => {
            setTab("dashboard")
        }
    }, [window.location.pathname, currentUser, loading])

    useEffect(() => {
        if (!userData) getUserData()
    }, [])


    function googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element')
    }


    return (
        <>
            <Helmet>
                <script type="text/javascript"
                    src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
            </Helmet>
            <div className={`private-nav d-none d-md-block theme-${props.theme}`}>
                <div className='logoConsole row m-0 align-items-center'>
                    <div className="col"></div>
                    <div onClick={() => navigate('/', { replace: true })} className='logoLink col m-1'>
                        <img loading='lazy' src={logoHorizontal} width="40px" alt="AgriTech" /> AgriTech Console
                    </div>
                    <div className="language-setter col d-flex align-items center h-100 justify-content-end">
                        {userData?.admin && < Button variant='success m-1' className='admin-btn' onClick={() => navigate("/admin/panel")}>Admin Panel</Button>}
                        <Button variant='success m-1' className='translate-intro' onClick={(e) => { googleTranslateElementInit(); e.target.hidden = true }} hidden={false}>Translate</Button>
                        <Button variant='success m-1' className='logout-intro' onClick={() => logout()}>Logout</Button>
                        <div id="google_translate_element"></div>
                    </div>
                </div>
                {/* <div className='d-flex justify-content-between pt-1'> */}
                <div className='links-container d-flex justify-content-between flex-wrap navigation-links-intro'>
                    {/* <div className='d-flex'> */}
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}><img loading='lazy' src={dashboard} height={45} width={45} />Dashboard</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}><img loading='lazy' src={wallet} height={45} width={45} />Wallet</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}><img loading='lazy' src={management} height={45} width={45} />Management</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}><img loading='lazy' src={campaigns} height={45} width={45} />Campaigns</li></Link>
                    <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}><img loading='lazy' src={agristore} height={45} width={45} />AgriStore</li></Link>
                    {/* </div> */}
                </div>
            </div >

            <div className={`private-nav d-block d-md-none theme-${props.theme}`}>
                <div className='logoConsole d-flex align-items-center'><img loading='lazy' src={logoHorizontal} width="40px" alt="AgriTech" />&nbsp;AgriTech Console</div>
                <div className='hamButtonNav navigation-links-intro'>
                    <FontAwesome name='bars' onClick={() => setHamShow(!hamShow)} className="fa-light fa-bars" />
                    {userData?.admin && < Button variant='success' className='admin-btn' onClick={() => navigate("/admin/panel")}>Admin Panel</Button>}
                    <Button variant='btn bg-primary text-white fw-bold bg-opacity-75' onClick={() => logout()}>LOGOUT</Button>
                </div>
                <div className={`dropDownNav ${hamShow ? 'showDropDownNav' : ''}`}>
                    <ul className='links-container p-0 justify-content-center d-flex flex-column align-items-center'>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                        <Link onClick={() => setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                        <li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>
                            <div className="language-setter">
                                <Button variant='success' onClick={(e) => { googleTranslateElementInit(); e.target.hidden = true }} hidden={false}>Translate</Button>
                                <div id="google_translate_element"></div>
                            </div>
                        </li>
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