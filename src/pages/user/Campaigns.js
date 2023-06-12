/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment,useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { CampaignWidget } from '../../assets/widgets/Widgets'
import useInput from '../../hooks/useInput'
import { createCampaign, getApproval } from '../../interceptors/web3ServerApi'
import { useUser } from '../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from 'react-bootstrap/esm/Spinner'
import '../../index.css'
import './Campaigns.css'
import { ToastContainer, toast } from 'react-toastify'
import PropTypes from 'prop-types'
import LogoImage from '../../assets/logo/logoImg.svg'
import './Campaigns.css'
import DatePicker from "react-datepicker"
import Loader from '../../assets/loader/Loader'
import {getUserPlans} from '../../interceptors/serverAPIs'

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
    className={` stepper-head ${isVertical ? 'vertical-stepper-head' : ''} ${isInline ? 'inline-stepper-head' : ''
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
  createCampaignFormRef,
  launchLoading
}) => {
  const submitCurrentStep = async () => {
    nextStepHandler()
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
          currentTabIndex===0
          ?()=>{createCampaignFormRef.current.checkValidity()
            ?submitCurrentStep()
            :toast.warning('Missing or invalid value. Please check the provided details')
          }
          :isLastStep
            ? submitHandler
            : stepperContent[currentTabIndex].clicked
              ? () => {stepperContent[currentTabIndex].clicked();submitCurrentStep()}
              : nextStepHandler
        }
        disabled={
          
          (isLastStep
            ? stepperContent.some((el) => !el.isComplete)
            : !stepperContent[currentTabIndex].isComplete) ||
          stepperContent[currentTabIndex].isLoading
        }
      >
        {isLastStep ? !launchLoading? 'Submit':'Launching...' : `Continue to ${stepperContent[currentTabIndex + 1].label}`}
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

let Stepper = ({ launchLoading,campaignFormRef,isRightToLeftLanguage, isVertical, isInline, stepperContent, submitStepper }) => {
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
            <Fragment key={'StepperContentKey'+i}>{i === currentTabIndex && el.content}</Fragment>
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
        createCampaignFormRef={campaignFormRef}
        launchLoading={launchLoading}
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

function StepperSelectPlanForm({selectedPlan,selectPlan,secondTermsHandler}){

  const [plans,setPlans] = useState(null)
  const [loading,setLoading] = useState(false)
  useEffect(()=>{
    setLoading(true)
    getUserPlans().then(e =>{
      console.log(e.data)
      setPlans(e.data.reverse())
      setLoading(false)
    })
  },[])


  function handleSelectPlan(id,ele){
    console.log(id)
    console.log(ele)
    selectPlan(id)
    secondTermsHandler()
  }

  return(
    <div className='PlanAssociateContainer'>
      <h2>Choose Plan To Associate</h2>
      <div className='UserPlans d-flex '>
        {loading
        ?(<div className='loaderFormSelectPlans text-center'>
          <Loader height='100px' width='100px' />
        </div>)
        :plans?.length
        ?plans.map((plan,key) => {
          const styleColor = selectedPlan===plan._id? 'borderS':plan.executing? 'borderE':''
          return(
            <div onClick={(e) => handleSelectPlan(plan._id,this)} key={'EachUserPlanKey'+key} className='EachUserPlan col-11'>
                <div className={`plan planBorder newEachPlanShadow ${styleColor}`} >
                  <div className="d-flex align-items-center justify-content-between">
                      <h5>{plan.title}</h5>
                      {
                       selectedPlan===plan._id && <div className="alert alert-primary p-1 m-0">&#10004; Selected</div>
                      }
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
                  </div>
              </div>
            </div>
          )
        })
        :<div className='noPlansForForm flex-grow-1 d-flex flex-column align-items-center justify-content-center'>
          <div className='m-3'>
            <img src={LogoImage} width='150px' height='150px' alt='Logo' />
          </div>
          <div className='m-3'>
            <h3>
              Oops..., you don't seem to have a plan
            </h3>
            <h6>
              You Must have a plan in order to launch a Campaign
            </h6>
          </div>
          <div className='m-3'>
            <Link className='btn btn-success' to={'/management/planning'} >
              Create one now?
            </Link>
          </div>
        </div>
      }
      </div>
    </div>
  )
}


function ModalForm({ show, handleShow }) {

  const { userData } = useUser()
  const title = useInput('text', 'Title Goes Here')
  
  const [deadline,setDeadline] = useState(new Date())
  const description = useInput('number', 'Describe your Campaign here')
  const target = useInput('number', 'Target Amount')
  const minContribution = useInput('number', 'Minimum Amount')
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false)
  
  const campaignFormRef = useRef();
  const plansContainerRef = useRef();
  
  const [associatedPlan,setAssociatedPlan] = useState();

  const password = useInput('password', 'Password')

  function changeDeadline(date){
   
    setDeadline(date)
  }
  useEffect(()=>{
    setEnableThird((prev) => ({ checked: associatedPlan? true:false,touched :false}));
  },[associatedPlan])

  async function handleSubmit() {
    // e.preventDefault()
    setCreateCampaignLoading(true)
    const deadlineToSend = Math.floor(deadline.getTime()/1000)
    console.log(deadlineToSend)
    const dataToSend = {
      title: title.value,
      deadline: deadlineToSend,
      description:description.value,
      target: target.value,
      minContribution: minContribution.value,
      password: password.value,
      walletAddress: userData.walletAddress,
      userId: userData._id,
      associatedPlan
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
      setDeadline(new Date())
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
    [enableThird, setEnableThird] = useState({
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
    })

  const firstTermsHandler = () => {
    setEnableSecond((prev) => ({ checked: true, touched: true }));
  };

  const secondTermsHandler = () => {
    setEnableThird((prev) => ({ checked: associatedPlan? true:false , touched: true }));
  };

  const thirdTermsHandler = () => {
    setEnableFourth((prev) => ({ checked: !prev.checked, touched: true }));
  };


  useEffect(e=>{

    plansContainerRef.current?.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      plansContainerRef.scrollLeft += evt.deltaY;
    });
  },[])

  const stepperContent= [
    {
      label: 'Basic Details',
      content: (
        <div>
          <label>
            <Form ref={campaignFormRef} onSubmit={firstTermsHandler}>{/**/} 
              <div className='createCampaginForm d-flex flex-wrap justify-content-center'>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor='createCampTitle'>Title</label>
                  <input required className='agri-input p-2' id='createCampTitle' {...title} />
                </fieldset>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor='createCampDeadline'>Deadline</label>
                  {/* <input required className='agri-input p-2' id='createCampDeadline' {...deadline} /> */}
                  <DatePicker
                    className='agri-input p-2'
                    minDate={new Date()} // +2592000
                    selected={deadline}
                    onChange={changeDeadline} 
                  />
                </fieldset>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor='createCampTarget'>Target</label>
                  <input required className='agri-input p-2' id='createCampTarget' {...target} />
                </fieldset>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor='createCampMinAmount'>Mininmum Amount</label>
                  <input required className='agri-input p-2' id='createCampMinAmount' {...minContribution} />
                </fieldset>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor='createCampPass'>Password</label>
                  <input required className='agri-input p-2' id='createCampPass' {...password} />
                </fieldset>
                <fieldset className="col-md-6 p-3">
                  <label htmlFor="refund">Refund Unused Funds</label>
                  <select className="agri-input p-2" id="refund" defaultValue={"allowed"} disabled={true}>
                    <option value={"allowed"}>Allowed</option>
                  </select>
                </fieldset>
              </div>
              <fieldset className="col-12 d-flex flex-column px-3">
                <label htmlFor='description'>Description</label>
                <textarea 
                  required
                  id='description'
                  rows={8}
                  {...description} />
              </fieldset>
              {/* <Button type='submit'>SUBMIT</Button> */}
            </Form>
          </label>
        </div>
      ),
      isError: !enableSecond.checked && enableSecond.touched,
      isComplete: enableSecond.checked,
    },
    {
      label: 'Choose Plan to Associate',
      content: (
        <div>
          <StepperSelectPlanForm secondTermsHandler={secondTermsHandler} selectedPlan={associatedPlan} selectPlan={setAssociatedPlan} />
        </div>
      ),
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
      clicked: ()=>{setEnableSubmit((prev) => ({ checked: true, touched: true }))},
      isError: !enableFourth.checked && enableFourth.touched,
      isComplete: enableFourth.checked,
    },
    {
      label: 'Launch',
      content: (
        <div className='text-center'>
          <h3>
            All Good, Click Submit to Launch
          </h3>
        </div>
      ),
      isError: !enableSubmit.checked && enableSubmit.touched,
      isComplete: enableSubmit.checked,
    },
  ];

  const submitStepper = () => {
    handleSubmit();
    destroyStepper();
  };
  const destroyStepper = () => {
    campaignFormRef.current.reset()
    setEnableSecond({
      checked: true,
      touched: false
    })
    setEnableThird({
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
        size='lg'
        centered
      >
        <Modal.Header className='ContributeModalTitle bg-success text-light' closeButton>
          <Modal.Title>Create Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            
            <div className="">
              <Stepper 
                campaignFormRef={campaignFormRef}
                stepperContent={stepperContent}
                submitStepper={submitStepper}
                launchLoading={createCampaignLoading}  
              />
            </div>
          </div>
        </Modal.Body>
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