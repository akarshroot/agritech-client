import React, { useEffect, useState, Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { CampaignWidget } from '../../assets/widgets/Widgets'
import useInput from '../../hooks/useInput'
import { createCampaign, getApproval } from '../../interceptors/web3ServerApi'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Spinner from 'react-bootstrap/esm/Spinner'
import '../../index.css'
import './Campaigns.css'
import { ToastContainer, toast } from 'react-toastify'
import PropTypes from 'prop-types'
import './Campaigns.css'

// STEPPER FUNCTIONS START
const Step = ({
  indicator,
  label,
  navigateToStepHandler,
  index,
  isActive,
  isComplete,
  isWarning,
  isError,
  isRightToLeftLanguage,
}) => {
  const classes = [''];

  if (isActive) {
    classes.push('is-active');
  }
  if (isComplete) {
    classes.push('is-complete');
  }
  if (isWarning) {
    classes.push('is-warning');
  }
  if (isError) {
    classes.push('is-error');
  }
  if (isRightToLeftLanguage) {
    classes.push('rightToLeft');
  }

  return (
    <div className={`stepper-step ${classes.join(' ')}`}>
      <div className="stepper-indicator">
        <span
          className="stepper-indicator-info"
          onClick={isComplete || isError ? () => navigateToStepHandler(index) : null}
        >
          {isComplete ? (
            <svg className="stepper-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
              <path d="M452.253 28.326L197.831 394.674 29.044 256.875 0 292.469l207.253 169.205L490 54.528z" />
            </svg>
          ) : (
            indicator
          )}
        </span>
      </div>
      <div className="stepper-label">{label}</div>
    </div>
  );
};

Step.propTypes = {
  indicator: PropTypes.oneOfType([PropTypes.node, PropTypes.number]),
  label: PropTypes.string.isRequired,
  navigateToStepHandler: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  isComplete: PropTypes.bool,
  isError: PropTypes.bool,
  isWarning: PropTypes.bool,
  isRightToLeftLanguage: PropTypes.bool,
};

const StepperHead = ({
  stepperContent,
  navigateToStepHandler,
  isVertical,
  isInline,
  isRightToLeftLanguage,
  currentTabIndex,
}) => (
  <div
    className={`stepper-head ${isVertical ? 'vertical-stepper-head' : ''} ${isInline ? 'inline-stepper-head' : ''
      }`}
  >
    {stepperContent.map((el, i) => (
      <Step
        key={i}
        index={i}
        navigateToStepHandler={navigateToStepHandler}
        isActive={i === currentTabIndex}
        isComplete={el.isComplete}
        isWarning={el.isWarning}
        isError={el.isError}
        isRightToLeftLanguage={isRightToLeftLanguage}
        indicator={i + 1}
        label={el.label}
      />
    ))}
  </div>
);

StepperHead.propTypes = {
  stepperContent: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      clicked: PropTypes.func,
      isWarning: PropTypes.bool,
      isError: PropTypes.bool,
      isComplete: PropTypes.bool,
      isLoading: PropTypes.bool,
    })
  ),
  navigateToStepHandler: PropTypes.func.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  isInline: PropTypes.bool,
  isVertical: PropTypes.bool,
  isRightToLeftLanguage: PropTypes.bool,
};

const StepperFooter = ({
  isPrevBtn,
  previousStepHandler,
  isLastStep,
  nextStepHandler,
  submitHandler,
  stepperContent,
  currentTabIndex,
}) => {
  const submitCurrentStep = async () => {
    await stepperContent[currentTabIndex].clicked();
    nextStepHandler();
  };

  return (
    <div
      className="stepper-footer"
      style={{ justifyContent: isPrevBtn ? 'space-between' : 'flex-end' }}
    >
      {isPrevBtn && (
        <Button variant="secondary" onClick={previousStepHandler}>
          Back to {stepperContent[currentTabIndex - 1].label}
        </Button>
      )}
      <Button
        variant="success my-3"
        onClick={
          isLastStep
            ? submitHandler
            : stepperContent[currentTabIndex].clicked
              ? submitCurrentStep
              : nextStepHandler
        }
        disabled={
          (isLastStep
            ? stepperContent.some((el) => !el.isComplete)
            : !stepperContent[currentTabIndex].isComplete) ||
          stepperContent[currentTabIndex].isLoading
        }
      >
        {isLastStep ? 'Submit' : `Continue to ${stepperContent[currentTabIndex + 1].label}`}
      </Button>
    </div>
  );
};

StepperFooter.propTypes = {
  isPrevBtn: PropTypes.bool,
  previousStepHandler: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool,
  nextStepHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  stepperContent: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      clicked: PropTypes.func,
      isWarning: PropTypes.bool,
      isError: PropTypes.bool,
      isComplete: PropTypes.bool,
      isLoading: PropTypes.bool,
    })
  ),
};

let Stepper = ({ isRightToLeftLanguage, isVertical, isInline, stepperContent, submitStepper }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0),
    isLastStep = currentTabIndex === stepperContent.length - 1,
    isPrevBtn = currentTabIndex !== 0;

  const navigateToStepHandler = (index) => {
    if (index !== currentTabIndex) {
      setCurrentTabIndex(index);
    }
  };

  const nextStepHandler = () => {
    setCurrentTabIndex((prev) => {
      if (prev !== stepperContent.length - 1) {
        return prev + 1;
      }
    });
  };

  const previousStepHandler = () => {
    setCurrentTabIndex((prev) => prev - 1);
  };

  const submitHandler = () => {
    submitStepper();
  };

  return (
    <div className="stepper-wrapper">
      <div style={{ display: isVertical ? 'flex' : 'block' }}>
        <StepperHead
          stepperContent={stepperContent}
          navigateToStepHandler={navigateToStepHandler}
          isVertical={isVertical}
          isInline={isInline}
          currentTabIndex={currentTabIndex}
          isRightToLeftLanguage={isRightToLeftLanguage}
        />
        <div className="stepper-body">
          {stepperContent.map((el, i) => (
            <Fragment key={i}>{i === currentTabIndex && el.content}</Fragment>
          ))}
        </div>
      </div>
      <hr />
      <StepperFooter
        isPrevBtn={isPrevBtn}
        previousStepHandler={previousStepHandler}
        isLastStep={isLastStep}
        nextStepHandler={nextStepHandler}
        submitHandler={submitHandler}
        stepperContent={stepperContent}
        currentTabIndex={currentTabIndex}
      />
    </div>
  );
};

Stepper.propTypes = {
  stepperContent: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      clicked: PropTypes.func,
      isWarning: PropTypes.bool,
      isError: PropTypes.bool,
      isComplete: PropTypes.bool,
      isLoading: PropTypes.bool,
    })
  ),
  submitStepper: PropTypes.func.isRequired,
  isInline: PropTypes.bool,
  isVertical: PropTypes.bool,
  isRightToLeftLanguage: PropTypes.bool,
};

// STEPPER FUNCTIONS END

function ModalForm({ show, handleShow }) {

  const { userData } = useUser()
  const title = useInput('text', 'Title Goes Here')
  const deadline = useInput('number', 'Deadline in seconds')
  const description = useInput('number', 'Talk about the benefits you will give to the contributors. You may define different returns as per contribution ranges')
  const target = useInput('number', 'Target Amount')
  const minContribution = useInput('number', 'Minimum Amount')
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false)
  const password = useInput('password', '')

  async function handleSubmit(e) {
    e.preventDefault()
    setCreateCampaignLoading(true)
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
      setCreateCampaignLoading(false)
    }

  }

  const [enableSecond, setEnableSecond] = useState({
    checked: true,
    touched: true,
  }),
    [enableThird, setEnableThrid] = useState({
      checked: false,
      touched: false,
    }),
    [enableFourth, setEnableFourth] = useState({
      checked: false,
      touched: false,
    }),
    [enableSubmit, setEnableSubmit] = useState({
      checked: false,
      touched: false,
    }),
    [isSecondStepLoading, setIsSecondStepLoading] = useState(false);

  const firstTermsHandler = () => {
    setEnableSecond((prev) => ({ checked: !prev.checked, touched: true }));
  };

  const secondTermsHandler = () => {
    setEnableThrid((prev) => ({ checked: !prev.checked, touched: true }));
  };

  const thirdTermsHandler = () => {
    setEnableFourth((prev) => ({ checked: !prev.checked, touched: true }));
  };

  //for demo purposes only
  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const secondStepAsyncFunc = async () => {
    //it can be an API call
    setIsSecondStepLoading(true);
    await timeout(3000);
    setIsSecondStepLoading(false);
    console.log('second step clicked');
  };

  const stepperContent = [
    {
      label: 'Basic Details',
      content: (
        <div>
          <label>
            <Form onSubmit={handleSubmit}>
              <div className='d-flex flex-wrap align-items-center'>
                <fieldset className="m-3">
                  <label htmlFor='createCampTitle'>Title</label><br />
                  <input id='createCampTitle' {...title} />
                </fieldset>
                <fieldset className="m-3">
                  <label htmlFor='createCampDeadline'>Deadline</label><br />
                  <input id='createCampDeadline' {...deadline} />
                </fieldset>
                <fieldset className="m-3">
                  <label htmlFor='description'>Description</label><br />
                  <textarea id='description' {...description} />
                </fieldset>
                <div className="form-group p-3">
                  <label htmlFor="refund">Refund Unused Funds</label>
                  <select className="form-control" id="refund" defaultValue={"allowed"} disabled={true}>
                    <option value={"allowed"}>Allowed</option>
                  </select>
                </div>
                <fieldset className="m-3">
                  <label htmlFor='createCampTarget'>Target</label><br />
                  <input id='createCampTarget' {...target} />
                </fieldset>
                <fieldset className="m-3">
                  <label htmlFor='createCampMinAmount'>Mininmum Amount</label><br />
                  <input id='createCampMinAmount' {...minContribution} />
                </fieldset>
                <fieldset className="m-3">
                  <label htmlFor='createCampPass'>Password</label><br />
                  <input id='createCampPass' {...password} />
                </fieldset>
              </div>
              <label>
                <input
                  type="checkbox"
                  checked={enableSecond.checked}
                  onChange={firstTermsHandler}
                />{' '}
                Accept first terms and conditions
              </label>

            </Form>
          </label>
        </div>
      ),
      isError: !enableSecond.checked && enableSecond.touched,
      isComplete: enableSecond.checked,
    },
    {
      label: 'Choose Plan',
      content: (
        <div>
          <label>
            <input
              type="checkbox"
              checked={enableThird.checked}
              onChange={secondTermsHandler}
            />{' '}
            Accept second terms and conditions
          </label>
        </div>
      ),
      clicked: () => secondStepAsyncFunc(),
      isLoading: isSecondStepLoading,
      isError: !enableThird.checked && enableThird.touched,
      isComplete: enableThird.checked,
    },
    {
      label: 'Expeced Returns',
      content: (
        <div>
          <label>
            <input
              type="checkbox"
              checked={enableFourth.checked}
              onChange={thirdTermsHandler}
            />{' '}
            Accept third terms and conditions
          </label>
        </div>
      ),
      isError: !enableFourth.checked && enableFourth.touched,
      isComplete: enableFourth.checked,
    },
    {
      label: 'Launch',
      content: (
        <div>
          <label>
            Click submit to launch!
          </label>
        </div>
      ),
      isError: !enableSubmit.checked && enableSubmit.touched,
      isComplete: enableSubmit.checked,
    },
  ];

  const submitStepper = () => {
    console.log('submitted');
  };
  const destroyStepper = () => {
    setEnableSecond({
      checked: false,
      touched: false
    })
    setEnableThrid({
      checked: false,
      touched: false
    })
    setEnableSubmit({
      checked: false,
      touched: false
    })
    setEnableFourth({
      checked: false,
      touched: false
    })
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
        onHide={() => {
          handleShow()
          destroyStepper()
        }}
        backdrop="static"
        keyboard={false}
        size='xl'
        centered
      >
        <Modal.Header className='ContributeModalTitle' closeButton>
          <Modal.Title>Create Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="">
              <Stepper stepperContent={stepperContent} submitStepper={submitStepper} />
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="danger" onClick={handleShow}>
            Discard
          </Button>
          <Button className='my-3' type='submit' variant="success" disabled={createCampaignLoading}>{createCampaignLoading ? <>
            Creating...
            <div class="spinner-border" role="status"></div>
          </> : "Create"}</Button>
        </Modal.Footer> */}
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
          <Modal.Title className='ContributeModal'>Contribute</Modal.Title>
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
  const { userData, getUserData, getUserCampaigns, userCampaigns, currentUser } = useUser();
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
    <div className='container'>
      <div className='row shadow my-4 justify-content-around'>
        <div className='col-sm-3 p-3'>
          <Button variant="success" onClick={handleShow}>
            + Create Campaign
          </Button>
        </div>
        <div className='col-sm-3 p-3'>
          <Button variant="success" onClick={() => { navigate("/campaigns/all", { replace: true }) }}>
            View All Campaigns
          </Button>
        </div>
      </div>
      <div className='px-2'>
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
                    <div className='widget col-sm-6 col-md-4 col-lg-3 p-4'>
                      <CampaignWidget {...data}>
                        <button onClick={handleShowContribute} className='neumorph-btn-green'>Contribute</button>
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