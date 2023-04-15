import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './Signup.css'
import { ToastContainer, toast } from 'react-toastify'

function Signup() {
    const name = useRef()
    const email = useRef()
    const phno = useRef()
    const password = useRef()
    const repassword = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { theme, signup } = useUser()

    async function processSignup(e) {
        const data = {
            name: name.current.value,
            email: email.current.value,
            phno: phno.current.value,
            password: password.current.value
        }
        e.preventDefault()
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
            setError(e.message)
        }
        setLoading(false)
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
            <div className={`signup-container theme-${theme}`}>
                <h1>SIGN UP</h1>
                <div className="error-message" hidden={!error}>{error}</div>
                <form onSubmit={(e) => processSignup(e)} id="signup">
                    <input ref={name} placeholder="Full Name" className='form-input' type="text" id="name" required /><br />
                    <input ref={email} placeholder="Email" className='form-input' type="email" id="email" required /><br />
                    <input ref={phno} placeholder="Phone Number" className='form-input' type="number" id="phno" required /><br />
                    <input ref={password} placeholder="Password" className='form-input' type="password" id="password" required /><br />
                    <input ref={repassword} placeholder="Re-type password" className='form-input' type="password" id="re-password" required /><br />
                    <input className='form-input' type="submit" value={loading ? "Please Wait..." : "Signup"} disabled={loading} />
                </form>
                <span>Already a member? <Link to="/login">Login here</Link></span>
            </div>
        </>
    )
}

export default Signup