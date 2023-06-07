import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useUser } from '../../context/UserContext'
import './Login.css'
import eyeClose from '../../assets/icons/eyes-closed.png'
import eyeOpen from '../../assets/icons/eyes-open.png'
import { ToastContainer, toast } from 'react-toastify'
import Helmet from 'react-helmet'

function Login() {
    const email = useRef()
    const password = useRef()
    const [loading, setLoading] = useState(false)
    const [pwdSrc, setPwdSrc] = useState(eyeOpen)
    const [pwdType, setPwdType] = useState('password')

    const changeIcon = () => {
        if (pwdSrc === eyeOpen) {
            setPwdSrc(eyeClose)
            setPwdType('text')
        }
        else {
            setPwdSrc(eyeOpen)
            setPwdType('password')
        }
    }

    const { theme, login } = useUser()

    async function processLogin(e) {
        e.preventDefault()
        setLoading(true)
        const credentials = {
            email: email.current.value,
            password: password.current.value
        }
        try {
            await login(credentials)
            toast.success("Login Successful!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (e) {
            toast.error("Invalid Email or Password", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log("after try")
            setLoading(false)
        }
        console.log("after try")
        setLoading(false)
    }

    return (
        <>
            <Helmet>
                <title>SignUp | AgriTech</title>
            </Helmet>
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
            <div>
                <div className="bg-login"></div>
                <div className="bg-overlay"></div>
                <div className={`p-5 text-light login-container theme-${theme}`}>
                    <h1>LOGIN</h1>
                    {/* <div className="error-message" hidden={!error}>{error}</div> */}
                    <div className='row justify-content-center'>
                        <form className='col-md-3' onSubmit={(e) => processLogin(e)} id="login">
                            <input ref={email} className='form-control' placeholder='Email' type="email" id="email" required /><br />
                            <div className='position-relative'><input ref={password} className='form-control' placeholder='Password' type={pwdType} id="password" required /><img src={pwdSrc} className='eye-icn' alt='' onClick={changeIcon} /></div>
                            <input className='form-input btn btn-success my-3' type="submit" value={loading ? "Please Wait..." : "Login"} disabled={loading} />
                        </form>
                    </div>
                    <span>Not a member? <Link to="/signup" className='text-light '>Create an account</Link> today!</span>
                    <div id="g_id_onload"
                        data-client_id="989520179418-ho72odl9i1ilvdclti8gag7cpfc991st.apps.googleusercontent.com"
                        data-context="signup"
                        data-ux_mode="popup"
                        data-login_uri="https://35.192.7.28/api/auth/signup"
                        data-nonce=""
                        data-itp_support="true">
                    </div>

                    <div class="g_id_signin"
                        data-type="standard"
                        data-shape="rectangular"
                        data-theme="outline"
                        data-text="continue_with"
                        data-size="large"
                        data-logo_alignment="left">
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login