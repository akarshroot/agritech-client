import React, { useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Table from 'react-bootstrap/esm/Table'

function AdminConsole() {
    const navigate = useNavigate()
    const { userData, getUserData, getAdminData, adminData } = useUser()

    useEffect(() => {
        console.log(userData);
        if (!userData) {
            getUserData()
        }
        if (!userData?.admin) {
            navigate("/forbidden")
        }
    }, [])

    useEffect(() => {
        if (userData) {
            getAdminData().then(res => {
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
            })
        }
    }, [])


    return (
        <div className='container py-4'>
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
            <h1 className='display-5'>Admin Panel</h1>
            <hr className='style-two' />
            <div className="panel-container d-flex">
                {/* <div className="widget w-25 p-4">
                    <h4>Total active users</h4>
                    <hr />
                    <h1>100</h1>
                </div> */}
                <div className="view-orders w-100">
                    <Table className='w-100' striped bordered>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>UserId</th>
                                <th>ProductId</th>
                                <th>Delivery Date</th>
                                <th>Order Date</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                adminData?.length === 0 ?
                                    <tr>
                                        <td colSpan={4}>No orders created yet.</td>
                                    </tr>
                                    :
                                    adminData?.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{data.user}</td>
                                                <td><Link to={"/agristore/product/" + data.product}>{data.product}</Link></td>
                                                <td>{new Date(data.etd).toString()}</td>
                                                <td>{new Date(data.created).toString()}</td>
                                                <td>{data.address}</td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminConsole