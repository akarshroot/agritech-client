import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { CampaignWidget } from '../../assets/widgets/Widgets'
import useInput from '../../hooks/useInput'
import { createCampaign, getApproval } from '../../interceptors/web3ServerApi'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Spinner from 'react-bootstrap/esm/Spinner'
import { ToastContainer, toast } from 'react-toastify'


function ModalForm({ show, handleShow }) {

  const { userData } = useUser()
  const title = useInput('text', 'Title Goes Here')
  const deadline = useInput('number', 'Deadline in seconds')
  const target = useInput('number', 'Target Amount')
  const minContribution = useInput('number', 'Minimum Amount')
  const password = useInput('password', 'Password')

  async function handleSubmit(e) {
    e.preventDefault()
    const dataToSend = {
      title: title.value,
      deadline: deadline.value,
      target: target.value,
      minContribution: minContribution.value,
      password: password.value,
      walletAddress: userData.walletAddress,
      userId: userData._id
    }
    console.log("Sending Data", dataToSend)
    const res = await createCampaign(dataToSend);
    if (res.status === 'Deployed Successfully') {
      toast.success(res.status, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      title.onChange('')
      deadline.onChange('')
      target.onChange('')
      minContribution.onChange('')
      password.onChange('')
      handleShow()
    }

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
      <Modal
        show={show}
        onHide={handleShow}
        backdrop="static"
        keyboard={false}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>


            <div className='d-flex flex-column align-items-center'>
              <fieldset>
                <label htmlFor='createCampTitle'>Title</label><br />
                <input id='createCampTitle' {...title} />
              </fieldset>
              <fieldset>
                <label htmlFor='createCampDeadline'>Deadline</label><br />
                <input id='createCampDeadline' {...deadline} />
              </fieldset>
              <fieldset>
                <label htmlFor='createCampTarget'>Target</label><br />
                <input id='createCampTarget' {...target} />
              </fieldset>
              <fieldset>
                <label htmlFor='createCampMinAmount'>Mininmum Amount</label><br />
                <input id='createCampMinAmount' {...minContribution} />
              </fieldset>
              <fieldset>
                <label htmlFor='createCampPass'>Password</label><br />
                <input id='createCampPass' {...password} />
              </fieldset>
              <Button className='my-3' type='submit' variant="success">Create</Button>
            </div>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export function ContributeModal({ show, handleShow, cid, minContri }) {

  const password = useInput('password', "Password")
  const amount = useInput('number', "how much?")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const toSendData = {
      amount: amount.value,
      password: password.value,
      cid
    }
    try {
      const res = await getApproval(toSendData);
      if (res.status === 'Success') {

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
        amount.onChange('')
        password.onChange('')
        handleShow()
      }
    } catch (error) {

      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false)
    }
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
      <Modal
        show={show}
        onHide={handleShow}
        backdrop="static"
        keyboard={false}
        size='md'
      >
        <Modal.Header>
          <Modal.Title>Contribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Minimum contribution is '{minContri}' KCO</h4>
          <Form onSubmit={handleSubmit}>
            <div className='d-flex flex-column align-items-center'>
              <fieldset>
                <label htmlFor={'contriCampAmount' + cid}>Amount</label><br />
                <input id={'contriCampAmount' + cid} {...amount} />
              </fieldset>
              <fieldset>
                <label htmlFor={'contriCampPassFor' + cid}>Confirm with password</label><br />
                <input id={'contriCampPassFor' + cid} {...password} />
              </fieldset>
              {
                loading
                  ? <Button className='my-3' variant="disabled">Contributing... <Spinner variant='secondary' /></Button>
                  : (
                    <div className='d-flex justify-content-around'>
                      <Button className='m-3' type='submit' variant="warning">Contribute</Button>
                      <Button className='m-3' variant="secondary" onClick={handleShow}>Close</Button>
                    </div>
                  )
              }

            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>

  )
}

function Campaigns() {
  const [showContribute, setShowContribute] = useState(false);
  const [show, setShow] = useState(false);
  const { userData, getUserData, getUserCampaigns, userCampaigns } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  function handleShow() {
    setShow(!show)
  }
  function handleShowContribute() {
    setShowContribute(!showContribute)
  }
  useEffect(() => {
    if (!userData) {
      setLoading(true)
      getUserData()
    }
    if (!userCampaigns)
      getUserCampaigns()
    setLoading(false)
  }, [])

  return (
    <div className='container p-2'>
      <div className='row shadow my-4 justify-content-around'>
        <div className='col-md-3 p-3'>
          <Button variant="success" onClick={handleShow}>
            + Create Campaign
          </Button>
        </div>
        <div className='col-md-3 p-3'>
          <Button variant="success" onClick={() => { navigate("/campaigns/all", { replace: true }) }}>
            View All Campaigns
          </Button>
        </div>
      </div>
      <div>
        <h1 className='display-6 text-start'>Your Campaigns</h1>
        <hr />
        <div className='row'>
          {loading ? <>Loading...</>
            :
            userCampaigns?.length === 0 ? <>No campaigns created yet.</>
              :
              userCampaigns?.map((data, i) => {
                return (
                  <React.Fragment key={'campaignsKey' + i}>
                    <div className='col-sm-6 col-md-4 col-lg-3 p-4'>
                      <CampaignWidget {...data}>
                        <Button onClick={handleShowContribute} variant='success'>Contribute</Button>
                      </CampaignWidget>
                      <ContributeModal
                        show={showContribute}
                        handleShow={handleShowContribute}
                        cid={data._id}
                        minContri={data.minContri}
                      />
                    </div>
                  </React.Fragment>
                )
              })
          }
        </div>
      </div>
      <ModalForm show={show} handleShow={handleShow} />
    </div>
  )
}

export default Campaigns