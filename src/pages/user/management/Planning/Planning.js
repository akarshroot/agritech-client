import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../../../context/UserContext'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


import './Planning.css'

function Planning() {
    const [userPlans, setUserPlans] = useState([
        {
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
    ])

    const { theme } = useUser()
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
        console.log("created");
        console.log(requirements);
    }

    function addItem(e) {
        e.preventDefault()
        setRequirements([...requirements, { item: "", quantity: 0, itemId: Date.now() }])
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

    return (
        <div className={`planning-container theme-${theme}`}>
            <div className="planning-header">
                <Link className="link" to="/management">&larr; Go back</Link><br />
                <h3>PLANNING</h3>
                <span className="subtext">Plan in advance for the next harvest season. You may refer to <Link className='link' to="/management/sales"><b>Sales</b></Link> reports to analyze which crops generate best profits.</span>
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
                            {
                                requirements.length === 0 ? <>No items added.<br /></> :
                                    requirements.map((req, idx) => {
                                        return (
                                            <div className="requirement-form-group">
                                                <input placeholder='Item name' onChange={(e) => { handleChange(e, idx) }} type="text" name='item' className='form-input' />
                                                <input placeholder='Quantity' onChange={(e) => { handleChange(e, idx) }} type="number" name='quantity' className='form-input' />
                                                <div style={{marginLeft: "5px"}}>
                                                    <InputGroup className="mb-3" style={{ width: "250px" }}>
                                                        <InputGroup.Text>₹</InputGroup.Text>
                                                        <Form.Control placeholder='Cost per unit' onChange={(e) => { handleChange(e, idx) }} type="number" name='estCost' aria-label="Amount (to the nearest rupee)" />
                                                        <InputGroup.Text>.00</InputGroup.Text>
                                                    </InputGroup>

                                                    <InputGroup className="mb-3" style={{ width: "250px" }}>
                                                        <InputGroup.Text>₹</InputGroup.Text>
                                                        <Form.Control placeholder='Sale price per unit' onChange={(e) => { handleChange(e, idx) }} type="number" name="estSale" aria-label="Amount (to the nearest rupee)" />
                                                        <InputGroup.Text>.00</InputGroup.Text>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                            <Button className='req-action-btns' disabled={requirements.length === 0} variant='danger' onClick={(e) => removeItem(e)}>X Delete last item</Button>
                            <Button className='req-action-btns' variant='success' onClick={(e) => { addItem(e) }}>+ Add new item</Button>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handlePlanModalClose}>
                            Discard
                        </Button>
                        <Button type='submit' form="create-plan" variant="success">
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="current-plans">
                    {
                        userPlans.length === 0 ? <>No plans created yet.</>
                            :
                            userPlans.map((plan) => {
                                return (
                                    <div className="plan" key={plan.id}>
                                        <h5>{plan.title}</h5>
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
                                                        <tr><th>Estimated Revenue</th><th>Estimated Profit</th></tr>
                                                        <tr><td>₹{new Intl.NumberFormat("en-IN").format(plan.estRevenue)}</td><td>₹{new Intl.NumberFormat("en-IN").format(plan.estRevenue - plan.estCost)}</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="action-center">
                                                <button className="button-28">Execute Plan</button>
                                                <button className="button-28 delete-plan">Delete Plan</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default Planning