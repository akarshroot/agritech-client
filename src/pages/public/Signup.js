import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './Signup.css'
import { ToastContainer, toast } from 'react-toastify'
import eyeClose from '../../assets/icons/eyes-closed.png'
import eyeOpen from '../../assets/icons/eyes-open.png'

function Signup() {
    const name = useRef()
    const email = useRef()
    const phno = useRef()
    const password = useRef()
    const repassword = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pwdSrc, setPwdSrc ]=useState(eyeOpen)
    const [pwdType, setPwdType]=useState('password')

    const changeIcon=()=>{
        if(pwdSrc === eyeOpen){
            setPwdSrc(eyeClose)
            setPwdType('text')
        }
        else{
            setPwdSrc(eyeOpen)
            setPwdType('password')
        }
    }

    const { theme, signup } = useUser()

    async function processSignup(e) {
        e.preventDefault()
        if(repassword.current.value !== password.current.value){
            showWarning("Password doesn't match !")
            return;
        }
        else{
            const data = {
                name: name.current.value,
                email: email.current.value,
                phno: phno.current.value,
                password: password.current.value
            }
            setLoading(true)
            try {
                await signup(data)
                toast.success("Signup Successful!", {
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
                toast.error("Invalid Signup! Try Again", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setError(e.message)
            }
            setLoading(false)
        }
    }
    const showWarning=(e)=>{
        toast.error(e, {
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

    return (
        <>
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
            <div className="bg-signup"></div>
            <div className="bg-overlay"></div>
            <div className={`bg-success bg-opacity-50 text-light signup-container theme-${theme}`}>
                <h1 className='mb-3'>SIGN UP</h1>
                {/* <div className="error-message" hidden={!error}>{error}</div> */}
                <div className='row justify-content-center'>
                    <form className='col-md-4' onSubmit={(e) => processSignup(e)} id="signup">
                        <input ref={name}  className='form-control' placeholder='Full Name' type="text" id="name" required /><br/>
                        <input ref={email} className='form-control' placeholder='Email' type="email" id="email" required /><br/>
                        <input ref={phno} className='form-control' placeholder='Phone Number' type="number" max="9999999999" min="1000000000" id="phno" required onInvalid={()=>{showWarning('Invalid PhoneNumber')}} /><br/>
                        <div className='position-relative'><input ref={password} className='form-control' placeholder='Password' type={pwdType} id="password" required /><img src={pwdSrc} className='eye-icn' alt='' onClick={changeIcon} /></div><br/>
                        <input ref={repassword} className='form-control' type="password" placeholder='Re-type Password' id="re-password" required /><br/>
                        <input className='form-input  btn btn-success' type="submit" value={loading ? "Please Wait..." : "Signup"} disabled={loading} />
                    </form>
                </div>
                <span>Already a member? <Link to="/login" className='text-light '>Login here</Link></span>
            </div>
        </>
    )
}

export default Signup