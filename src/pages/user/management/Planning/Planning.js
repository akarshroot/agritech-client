import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Planning.css'
import ManagementContext from '../../../../context/ManagementContext';

function Planning() {
    const navigate = useNavigate()
    const [userPlans, setUserPlans] = useState([])

    /**
     * {
            id: "1",
            title: "Demo Plan",
            requirements: [
                {
                    item: "Wheat Seeds",
                    quantity: 64
                },
                {
                    item: "Beetroot Seeds",
                    quantity: 32
                },
            ],
            duration: "6 months",
            estCost: 150000,
            estRevenue: 200000
        }
     */

    const { theme, currentUser } = useUser()
    const { createPlan, getUserPlans, deleteUserPlan, executeUserPlan } = useContext(ManagementContext)
    const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false)

    const planTitle = useRef()
    const planDuration = useRef()
    const createPlanForm = useRef()
    const [requirements, setRequirements] = useState([])

    const handlePlanModalClose = () => {
        createPlanForm.current.reset()
        setRequirements([])
        setCreatePlanModalOpen(false);
    }
    const handlePlanModalOpen = () => setCreatePlanModalOpen(true);

    async function handleCreateNewPlan(e) {
        e.preventDefault()

        const planData = {
            title: planTitle.current.value,
            duration: parseInt(planDuration.current.value),
            durationType: "months",
            requirements: requirements
        }
        console.log(planData);
        const data = await createPlan(planData)

        if (data.error)
            toast.error(data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        else {
            toast.success(data.message, {
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
        handlePlanModalClose()
        setTimeout(() => { window.location.reload() }, 2000)
    }

    function addItem(e) {
        e.preventDefault()
        setRequirements([...requirements, { item: "", quantity: 0, itemId: Date.now(), isProduct: false }])
    }

    function removeItem(e, idx) {
        e.preventDefault()
        // setRequirements([...requirements.filter(req => req.id != id)])
        let data = [...requirements];
        data.splice(requirements.length - 1, 1)
        setRequirements(data)
    }

    function handleChange(e, idx) {
        let data = [...requirements];
        data[idx][e.target.name] = e.target.value;
        setRequirements(data);
    }

    async function fetchUserPlans() {
        const plans = await getUserPlans()
        //recent plans first
        plans.data.reverse()
        //plans under execution first
        plans.data.sort(function (x, y) { return x.executing == true ? -1 : y.executing == true ? 1 : 0; })
        setUserPlans(plans.data)
    }

    async function deletePlan(planId) {
        const data = await deleteUserPlan(planId)
        if (data.error)
            toast.error(data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        else {
            toast.success(data.message, {
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

        setTimeout(() => { window.location.reload() }, 2000)
    }

    async function executePlan(planId) {
        const data = await executeUserPlan(planId)
        if (data.error) {
            toast.error(data.message, {
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
        else {
            toast.success(data.message, {
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
        setTimeout(() => { window.location.reload() }, 2000)
    }

    useEffect(() => {
        if (currentUser) fetchUserPlans()
    }, [currentUser])

    return (
        <div className={`planning-container theme-${theme}`}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="planning-header">
                <Button className="link m-2" onClick={() => navigate("/management")} variant='warning'>&larr; Go back</Button>
                <div className="m-2">
                    <h3>Planning</h3>
                    <span className="subtext">Plan in advance for the next harvest season. You may refer to Sales reports to analyze which crops generate best profits.</span>
                </div>
            </div>
            <hr className="style-two" />
            <div className="planning-content">
                <button className="button-28" onClick={handlePlanModalOpen}>Create New Plan</button>
                <Modal show={createPlanModalOpen} onHide={handlePlanModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref={createPlanForm} id="create-plan" onSubmit={handleCreateNewPlan} className="create-plan-form">
                            <input ref={planTitle} placeholder="Title" className='form-input' type="text" id="plan-title" required /><br />
                            <input ref={planDuration} placeholder="Duration in months" className='form-input' type="number" min={1} id="duration" required /><br />
                            <h5>Items</h5>
                            <div className="notranslate">
                                {
                                    requirements.length === 0 ? <>No items added.<br /></> :
                                        requirements.map((req, idx) => {
                                            return (
                                                <div className="requirement-form-group" key={idx} >
                                                    <input placeholder='Item name' onChange={(e) => { handleChange(e, idx) }} type="text" name='item' className='form-input' />
                                                    <div className="yield-section d-flex w-100 align-items-center">
                                                        <input placeholder='Est. Yield / उपज' min={1} step={0.1} onChange={(e) => { handleChange(e, idx) }} type="number" name='yield' className='form-input' />
                                                        <div className="item-hints">
                                                            <div className="hint" data-position="4">
                                                                <span className="hint-dot d-flex justify-content-center align-items-center fw-bold">i</span>
                                                                <div className="hint-content bg-success text-white p-2 do--split-children d-none d-md-block">
                                                                    <p>
                                                                        Yield is the seed to crop conversion ratio. Example: If you get 20 Kgs of a crop from 1 Kg of its seeds, yield is 20.</p>
                                                                    <hr />
                                                                    <p>
                                                                        उपज बीज से फसल रूपांतरण अनुपात है। उदाहरण: यदि एक किलो बीज से 20 किलो फसल प्राप्त होती है, तो उपज 20 होती है।</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input placeholder='Quantity' min={1} onChange={(e) => { handleChange(e, idx) }} type="number" name='quantity' className='form-input' />
                                                        <select className="form-select form-input" aria-label="Category" name='category' onChange={(e) => { handleChange(e, idx) }} required>
                                                            <option selected disabled>Category</option>
                                                            <option value="crop">Crop Seeds</option>
                                                            <option value="supplement">Supplements</option>
                                                        </select>
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <InputGroup className="m-1" style={{ width: "250px" }}>
                                                            <InputGroup.Text>₹</InputGroup.Text>
                                                            <Form.Control placeholder='Cost per unit' onChange={(e) => { handleChange(e, idx) }} type="number" name='estCost' aria-label="Amount (to the nearest rupee)" />
                                                            <InputGroup.Text>.00</InputGroup.Text>
                                                        </InputGroup>
                                                        <InputGroup className="m-1" style={{ width: "250px" }} hidden={req.category == 'supplement'}>
                                                            <InputGroup.Text>₹</InputGroup.Text>
                                                            <Form.Control placeholder='Sale price per unit' onChange={(e) => { handleChange(e, idx) }} type="number" name="estSale" aria-label="Amount (to the nearest rupee)" />
                                                            <InputGroup.Text>.00</InputGroup.Text>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                            </div>
                            <Button className='req-action-btns' disabled={requirements.length === 0} variant='danger' onClick={(e) => removeItem(e)}>&#10008; Delete last item</Button>
                            <Button className='req-action-btns' variant='success' onClick={(e) => { addItem(e) }}>&#10010; Add new item</Button>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handlePlanModalClose}>
                            Discard
                        </Button>
                        <Button type='submit' form="create-plan" variant="success" >
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="current-plans">
                    {
                        userPlans.length === 0 ? <>No plans created yet.</>
                            :
                            userPlans.map((plan, key) => {
                                return (
                                    <div className="plan" key={"plan_key_" + key} style={plan.executing ? { border: "2px solid green" } : {}}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5>{plan.title}</h5>
                                            <div className="alert alert-success p-1 m-0" hidden={!plan.executing}>&#10004; Executing</div>
                                        </div>
                                        <hr className="style-two" />
                                        <div className="plan-details">
                                            <div className="requirements">
                                                <table>
                                                    <tbody>
                                                        <tr><th>Item</th><th>Quantity</th></tr>
                                                        {
                                                            plan.requirements.map((req, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{req.item}</td>
                                                                        <td>{req.quantity}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="specifics">
                                                <table>
                                                    <tbody>
                                                        <tr><th>Duration</th><th>Estimated Cost</th></tr>
                                                        <tr><td>{plan.duration}</td><td>₹{new Intl.NumberFormat("en-IN").format(plan.estCost)}</td></tr>
                                                        <tr><th>Estimated Revenue</th><th>Estimated {plan.estRevenue - plan.estCost > 0 ? "Profit" : "Loss"}</th></tr>
                                                        <tr><td>₹{new Intl.NumberFormat("en-IN").format(plan.estRevenue)}</td><td>₹{new Intl.NumberFormat("en-IN").format(Math.abs(plan.estRevenue - plan.estCost))}</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="action-center">
                                                <button className="button-28" onClick={() => executePlan(plan._id)} disabled={plan.executing}>Execute Plan</button>
                                                <button className="button-28 delete-plan" onClick={() => deletePlan(plan._id)} disabled={plan.executing}>Delete Plan</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </div >
    )
}

export default Planning