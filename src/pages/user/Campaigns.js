/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useRef, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import DatePicker from "react-datepicker"
import PropTypes, { func } from 'prop-types'
import FontAwesome from 'react-fontawesome';
import Spinner from 'react-bootstrap/esm/Spinner'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import useInput from '../../hooks/useInput'
import { createCampaign, postcontribution } from '../../interceptors/web3ServerApi'
import { useUser } from '../../context/UserContext'
import LogoImage from '../../assets/logo/logoImg.svg'
import Loader from '../../assets/loader/Loader'
import { getCollectonCampbyId, getUserPlans } from '../../interceptors/serverAPIs'

import './Campaigns.css'
import '../../index.css'
import { Helmet } from 'react-helmet'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import ManagementContext from '../../context/ManagementContext'
import Table from 'react-bootstrap/esm/Table'
import StoreContext from '../../context/StoreContext'


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
  launchLoading,
  descriptionField
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
          currentTabIndex === 0
            ? () => {
              createCampaignFormRef.current.checkValidity() && descriptionField != ""
                ? submitCurrentStep()
                : toast.warn('Missing or invalid value. Please check the provided details')
            }
            : isLastStep
              ? submitHandler
              : stepperContent[currentTabIndex].clicked
                ? () => { stepperContent[currentTabIndex].clicked(); submitCurrentStep() }
                : nextStepHandler
        }
        disabled={

          (isLastStep
            ? stepperContent.some((el) => !el.isComplete)
            : !stepperContent[currentTabIndex].isComplete) ||
          stepperContent[currentTabIndex].isLoading
        }
      >
        {isLastStep ? !launchLoading ? 'Submit' : 'Launching...' : `Continue to ${stepperContent[currentTabIndex + 1].label}`}
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

let Stepper = ({ launchLoading, campaignFormRef, isRightToLeftLanguage, isVertical, isInline, stepperContent, submitStepper, descriptionField }) => {
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
            <Fragment key={'StepperContentKey' + i}>{i === currentTabIndex && el.content}</Fragment>
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
        descriptionField={descriptionField}
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

function StepperSelectPlanForm({ selectedPlan, selectPlan, secondTermsHandler }) {
  const { userData } = useUser()
  const [plans, setPlans] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getUserPlans().then(e => {
      if (!userData.currentPlan)
        setPlans(e.data.reverse())
      else
        setPlans(e.data?.filter(p => p.executing === true))
      setLoading(false)
    })
  }, [userData])


  function handleSelectPlan(plan) {
    selectPlan(plan)
    secondTermsHandler()
  }

  return (
    <div className='PlanAssociateContainer'>
      <h2>Choose Plan To Associate</h2>
      <div className="d-flex align-items-center">
        <div className='UserPlans d-flex w-100'>
          {loading
            ? (<div className='loaderFormSelectPlans text-center'>
              <Loader height='100px' width='100px' />
            </div>)
            : plans?.length
              ? plans.map((plan, key) => {
                const styleColor = selectedPlan?._id === plan._id ? 'borderS' : plan.executing ? 'borderE' : ''
                return (
                  <div onClick={() => handleSelectPlan(plan)} key={'EachUserPlanKey' + key} className='EachUserPlan col-11'>
                    <div className={`plan planBorder newEachPlanShadow ${styleColor}`} >
                      <div className="d-flex align-items-center justify-content-between">
                        <h5>{plan.title}</h5>
                        {
                          selectedPlan._id === plan._id && <div className="alert alert-primary p-1 m-0">&#10004; Selected</div>
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
              : <div className='noPlansForForm flex-grow-1 d-flex flex-column align-items-center justify-content-center'>
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
        {
          plans?.length === 1 ?
            <div className="item-hints d-flex flex-row-reverse align-items-center">
              <div className="hint" data-position="4">
                <span className="hint-dot d-flex justify-content-center align-items-center fw-bold">i</span>
                <div className="hint-content bg-success text-white p-2 d-none d-md-block">
                  <p>
                    Not seeing the plan you created? Make sure you don't have any plans under execution. Only one plan is allowed to execute at one time.
                  </p>
                  <p>
                    आपके द्वारा बनाई गई योजना को नहीं देख रहे हैं? सुनिश्चित करें कि आपके पास निष्पादन के तहत कोई योजना नहीं है। एक समय में केवल एक ही योजना को क्रियान्वित करने की अनुमति है।
                  </p>
                </div>
              </div>
            </div>
            :
            <></>
        }
      </div>
    </div>
  )
}

/*
{
  crop:'',
  quantity:'',
  discount:'',
  unit:'Kg',
}
{crop:'',quantity:'',discount:'',unit:'Kg'}
*/

function DiscountPromise({ cropsArr, promises, setPromises, handleAddPromise, KCOLimit }) {

  const [crop, setCrop] = useState(cropsArr[0].item)
  const quantityInput = useInput('number', 'quantity?')
  const discountInput = useInput('number', 'discount here')
  const [unit, setUnit] = useState('kilogram')

  console.log(crop)

  function handleFormSubmit(e) {
    e.preventDefault()
    // saved,crop,quantity,discount,unitKg'
    handleAddPromise(true, crop, quantityInput.value, discountInput.value, unit)
    setCrop(cropsArr[0].item)
    quantityInput.onChange('')
    discountInput.onChange('')
    setUnit('kilogram')
  }

  return (
    <div className='border border-1 border-success rounded p-1'>
      <form onSubmit={handleFormSubmit}>
        <input {...discountInput} />
        % discount on my yeild of <br />
        <select onChange={(e) => { setCrop(e.target.value) }}>
          {cropsArr.map((e, i) => (
            <option value={e.item} key={'eachCropOption' + i + 'for' + promises[promises.length - 1]?.promiseId}>
              {e.item}
            </option>))}
        </select>for up to <br />
        <input {...quantityInput} />
        <br />
        <select defaultValue={'kilogram'} onChange={(e) => setUnit(e.target.value)}>
          <option value={'kilogram'}>{'(Kg)'}Kilogram</option>
          <option value={'gram'}>{'(g)'}Gram</option>
          <option value={'quintal'}>{'(q)'}Quintal</option>
          <option value={'tonne'}>{'(ton)'}Tonne</option>
          <option value={'Pounds'}>{'(lbs)'}Pounds</option>
        </select>
        <div className='m-1 d-flex justify-content-end'>
          <button className='btn btn-sm btn-outline-success'>
            + Add this Promise
          </button>
        </div>
      </form>
    </div>
  )
}

function EachPledgePlan({ associatedPlan, checkedForNext, plansAllowed, setPlansAllowed, planData, id }) {
  const [saved, setSaved] = useState(planData.saved)
  const [promises, setPromises] = useState(planData.selectedCrops)

  const headingTop = useInput('text', "Pledge name")
  const investment = useInput('number', "KCO")
  const discount = useInput('number', "Discount")



  const cropsArr = associatedPlan.requirements.filter(e => e.category === 'crop')

  console.log("Promise-->", promises)

  useEffect(() => {
    if (planData.headingTop && planData.investment && planData.discount && saved) {
      headingTop.onChange(planData.headingTop)
      investment.onChange(planData.investment)
      discount.onChange(planData.discount)
    }
  }, [handleRemove, handleSave])

  const unsavedPromises = promises.filter(e => !e.saved)

  function handleSave() {
    if (checkedForNext) {
      toast.warn('uncheck terms to edit further')
      return
    }
    if (!promises.length) {
      toast.warn('Must Have atleat 1 promise')
      return
    }
    setSaved(!saved)

    const index = plansAllowed.findIndex(e => e.id === id)
    const objUpdate = plansAllowed[index]
    const filteredArr = plansAllowed.filter(e => e.id !== id)
    if (!saved) {
      objUpdate.selectedCrops = promises
      objUpdate.KCOLimit = investment.value
      objUpdate.name = headingTop.value
    }
    objUpdate.saved = !saved
    filteredArr.splice(index, 0, objUpdate)
    setPlansAllowed(filteredArr)
  }

  function handleRemove() {
    if (plansAllowed.length === 1) {
      toast.warn("You must have atleast one return promise in order to proceed")
      return
    }
    const newArr = plansAllowed.filter(e => e.id !== id);
    setPlansAllowed(newArr)
  }




  function handleAddPromise(saved = false, crop = '', quantity = 0, discount = 0, unit = 'Kg') {
    const newPromiseObj = {
      saved,
      crop,
      quantity,
      discount,
      unit,
      promiseId: ("promiseOnPlan" + id + "for" + Date.now())
    }
    if (unsavedPromises.length) {
      toast.warn('Already a promise is in editing')
      return
    }
    setPromises((prev) => ([...prev, newPromiseObj]))
  }

  function handlePromiseRemove(promiseId) {
    setPromises(prev => {
      return [...prev.filter(e => e.promiseId !== promiseId)]
    })
  }


  return (
    <div className='eachPledgePlan m-3'>
      <header>
        <div className='d-flex justify-content-between align-items-center'>
          {saved ? <h2>{planData.name}</h2> : <input {...headingTop} />}
          {saved ? <h4>{planData.KCOLimit} KCO</h4> : <input className='w-25' {...investment} />}
        </div>
      </header>
      <hr />
      <main>
        {promises.map(({ crop, quantity, unit, discount, promiseId }, key) => (
          <div key={'promiseOnPlan' + id + 'for' + key}>
            <div>
              {!saved && <button onClick={() => handlePromiseRemove(promiseId)} className='btn btn-outline-danger'>Remove</button>}<br />
              {discount}% discount
              on my yeild of {crop} for up
              to {quantity} {unit}
            </div>
            <hr />
          </div>
        ))}
        {!saved &&
          <div className='mb-5'>
            <DiscountPromise
              setPromises={setPromises}
              promises={promises}
              cropsArr={cropsArr}
              handleAddPromise={handleAddPromise}
            />
            <hr />
          </div>
        }
      </main>
      <div className='controlsButtonForPledgePlans'>
        <Button variant='outline-success' onClick={handleSave} >{saved ? 'Edit' : 'Save'}</Button>
        <Button variant='outline-danger mx-2' onClick={handleRemove}>Remove</Button>
      </div>
    </div>
  )
}

function PledgeReturnsForm({ associatedPlan, plansAllowed, setPlansAllowed, checkedForNext, manager }) {


  function addNewPlan() {

    if (checkedForNext) {
      toast.warn('Uncheck terms to edit further')
      return
    }
    const prevPlan = plansAllowed[plansAllowed.length - 1]
    console.log(prevPlan)
    const allForms = plansAllowed.filter(e => !e.saved)
    if (!prevPlan.name.length || !prevPlan.KCOLimit || !prevPlan.selectedCrops.length || allForms.length) {
      toast.warn('Save/complete all plan before creating a new one')
      return
    } else {
      const newPlansObj = {
        id: ('IdForEachPledgePlan' + Date.now()),
        KCOLimit: 0,
        name: '',
        selectedCrops: [],
        saved: false,
      }
      const newPlans = [...plansAllowed, newPlansObj]
      setPlansAllowed(newPlans)
    }
  }

  return (
    <div className='pledgeReturnsForm'>

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
      <div className={`createPledgeContainer ${checkedForNext && 'overflow-hidden'}`}>
        <div className={`disableFormContainer ${!checkedForNext && 'd-none'}`} >
          <FontAwesome name="check" />
          All Set
        </div>
        {plansAllowed.map((e, i) => { return <EachPledgePlan associatedPlan={associatedPlan} checkedForNext={checkedForNext} planData={e} plansAllowed={plansAllowed} key={'EachPledgeToCreate' + i} id={e.id} setPlansAllowed={setPlansAllowed} /> })}
        <div className='createNewPlanDiv m-3'>
          {
            plansAllowed.length < manager.allowedCampaignReturnSlots
              ? (
                <div onClick={addNewPlan} className='createNewPlanDivIcon PlusIcon'>
                  <FontAwesome className='LockIcon' name='fas fa-plus' />
                </div>
              )
              : (
                <div onClick={() => console.log('coming soon')} className='createNewPlanDivIcon'>
                  <FontAwesome className='LockIcon' name='fas fa-lock' />
                  <div>
                    ...coming soon
                  </div>
                </div>
              )
          }

        </div>
      </div>
    </div>
  )
}

function ModalForm({ show, handleShow }) {

  const { userData } = useUser()
  const title = useInput('text', 'Title Goes Here')
  const [featuredImage, setFeaturedImage] = useState()
  const [deadline, setDeadline] = useState(new Date())
  const [description, setDescription] = useState("")
  const [descriptionFormat, setDescriptionFormat] = useState([
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ])
  const [descriptionModules, setDescriptionModules] = useState({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  })
  const target = useInput('number', 'Target Amount')
  const minContribution = useInput('number', 'Minimum Amount')
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false)
  const campaignFormRef = useRef();

  const [plansAllowed, setPlansAllowed] = useState([{
    id: 'INITIALID',
    KCOLimit: 0,
    selectedCrops: [],
    name: '',
    saved: false,
  }])

  const [associatedPlan, setAssociatedPlan] = useState({ _id: '' });
  const password = useInput('password', 'Password')
  function changeDeadline(date) {
    setDeadline(date)
  }
  useEffect(() => {
    setEnableThird((prev) => ({ checked: associatedPlan ? true : false, touched: false }));
  }, [associatedPlan])

  async function handleSubmit() {
    // e.preventDefault()
    setCreateCampaignLoading(true)
    const deadlineToSend = Math.floor(deadline.getTime() / 1000)


    console.log('planAllowed', plansAllowed)

    const formedPlansAllowed = plansAllowed.map(e => {
      const { id, saved, ...toSend } = e
      console.log('toSend', toSend)
      const ans = toSend.selectedCrops.map(f => {
        const { saved, promiseId, ...r3 } = f
        return r3
      })
      toSend.selectedCrops = ans
      return toSend
    })

    console.log('preform', formedPlansAllowed)

    const dataToSend = {
      title: title.value,
      deadline: deadlineToSend,
      description: description,
      target: target.value,
      minContribution: minContribution.value,
      password: password.value,
      walletAddress: userData.walletAddress,
      userId: userData._id,
      pledges: formedPlansAllowed,
      featuredImage: featuredImage,
      associatedPlan: associatedPlan._id
    }
    const res = await createCampaign(dataToSend);
    // const res = ''
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
    setEnableThird((prev) => ({ checked: associatedPlan ? true : false, touched: true }));
  };

  const thirdTermsHandler = () => {
    setEnableFourth((prev) => ({ checked: !prev.checked, touched: true }));
  };

  function handlePledgesSubmission() {
    const allForms = plansAllowed.filter(e => !e.saved)
    const prevPlan = plansAllowed[plansAllowed.length - 1]
    if (!prevPlan.name.length || !prevPlan.KCOLimit.length || !prevPlan.selectedCrops.length || allForms.length) {
      toast.warn("Invalid/Unsaved Pledges")
    } else {

      thirdTermsHandler()
    }
  }

  function handleEditorReady(editor) {
    // this is a reference back to the editor if you want to
    // do editing programatically
    editor.insertString("editor is ready");
  }
  function handleDescChange(html, text) {
    // html is the new html content
    // text is the new text content
  }

  const stepperContent = [
    {
      label: 'Basic Details',
      content: (
        <div>
          <Form ref={campaignFormRef} onSubmit={firstTermsHandler} encType='multipart/form-data'>
            <div className='createCampaginForm d-flex flex-wrap justify-content-center'>
              <fieldset className="col-md-6 p-3">
                <label htmlFor='createCampTitle'>Title</label>
                <input required className='agri-input p-2' id='createCampTitle' {...title} />
              </fieldset>
              <fieldset className="col-md-6 p-3">
                <label htmlFor='createCampDeadline'>Deadline</label>
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
                <label htmlFor='createCampFeatureImg'>Featured Image</label>
                <input required onChange={(e) => setFeaturedImage(e.target.files[0])} type='file' name='featured-image' className='agri-input p-2' id='createCampFeatureImg' accept="image/png, image/jpeg, image/svg" />
              </fieldset>
              <fieldset className="col-md-6 p-3">
                <label htmlFor="refund">Refund Unused Funds</label>

                <select className="btn disabled btn-secondary agri-input p-2" id="refund" defaultValue={"allowed"} disabled={true}>
                  <option value={"allowed"}>Allowed</option>
                </select>

              </fieldset>
              <fieldset className="col-md-12 p-3">
                <ReactQuill
                  value={description}
                  onChange={(e) => setDescription(e)}
                  modules={descriptionModules}
                  formats={descriptionFormat}
                  theme="snow"
                />
                {/* <input type='text' style={{ visibility: "hidden" }} value={description} required /> */}
              </fieldset>
            </div>
          </Form>
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
      label: 'Pledge your Returns',
      content: (
        <div>
          <PledgeReturnsForm associatedPlan={associatedPlan} manager={userData} checkedForNext={enableFourth.checked} plansAllowed={plansAllowed} setPlansAllowed={setPlansAllowed} />
          <label>
            <input
              type="checkbox"
              checked={enableFourth.checked}
              onChange={handlePledgesSubmission}
            />{' '}
            Accept third terms and conditions
          </label>
        </div>
      ),
      clicked: () => {
        setEnableSubmit((prev) => ({ checked: true, touched: true }))
      },
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
    // console.log(campaignFormRef)
    // campaignFormRef.current.reset()
    title.onChange('')
    setDescription('')
    setDeadline(new Date())
    password.onChange('')
    minContribution.onChange('')
    target.onChange('')
    setFeaturedImage(null)

    setAssociatedPlan({ _id: '' })
    setPlansAllowed([{
      id: 'INITIALID',
      KCOLimit: '',
      selectedCrops: [],
      name: '',
      saved: false,
    }])
    setEnableSecond({
      checked: false,
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
                descriptionField={description}
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
      const res = await postcontribution(toSendData);
      if (!res.error) {
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
      else throw new Error(res.message)
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

function CampaignWidgetV2({ title, target, contributors, _id, ...props }) {
  const numberOfContributors = contributors?.length
  const [collection, setCollection] = useState(0)

  useEffect(() => {
    if (_id)
      getCollectonCampbyId(_id).then((res) => {
        setCollection(res.raisedAmount)
      }).catch((err) => alert(err.message))
  }, [_id])


  return (
    <div className='widget-container'>

      {(title && target && contributors && _id) ?
        <>
          <h3 className='container'>
            {title}
          </h3>
          <h4>Campaign Progress</h4>
          <hr />


          <div className="campaign-progress">
            <div className="progress neumorphInto" style={{ height: "30px" }}>
              <div className="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar"
                aria-valuenow={parseInt((collection / target) * 100)} aria-valuemin="0" aria-valuemax="100" style={{ width: `${parseInt((collection / target) * 100)}%` }}>
                {`${parseInt((collection / target) * 100)}%`}
              </div>
            </div>
            <span className="subtext">
              {new Intl.NumberFormat("en-IN").format(collection)} KCO of {new Intl.NumberFormat("en-IN").format(target)} KCO raised
            </span>
          </div>


          <div className="current-campaign-widget-details">
            <div className="contributions">
              <span className="quantity">{numberOfContributors > 1000 ? `${numberOfContributors / 1000}k+` : numberOfContributors}</span><br />
              <span className="subtext">contributors</span>
            </div>
            <div className="time-remaining">
              <span className="quantity">{parseInt(((props.deadline * 1000) - Date.now()) / (1000 * 60 * 60 * 24))}d</span><br />
              <span className="subtext">remaining</span>
            </div>
          </div>
          <div className="widget-action-center d-flex justify-content-around mt-3">
            <Link to={'/campaign/details/' + _id} variant='outline-success' >Details</Link>
            {props.children}
          </div>
        </>
        :
        <h4>
          No campaigns yet.
        </h4>
      }

    </div>
  )
}

function InventoryToFarmFreshModal({ show, handleShow, campaign }) {
  const [loading, setLoading] = useState(false)
  const [crops, setCrops] = useState([])
  const [inventoryData, setInventoryData] = useState([])

  const [confirmModal, setConfirmModal] = useState(false)
  const handleConfirm = () => setConfirmModal(!confirmModal)

  const { getUserPlans } = useContext(ManagementContext)
  const { sendToFarmFresh } = useContext(StoreContext)

  function handleCropImage(file, cropId) {
    console.log("setting")
    const inventoryCrops = [...inventoryData]
    const crop = inventoryCrops.find(crop => crop._id === cropId)
    crop.image = file
    setInventoryData(inventoryCrops)
  }

  function handleCropsInfo(e) {
    const cropId = e.target.name.split("-")[0]
    const attribute = e.target.name.split("-")[1]
    const inventoryCrops = [...inventoryData]
    const crop = inventoryCrops.find(crop => crop._id === cropId)
    crop[attribute] = e.target.type === 'number' ? parseInt(e.target.value) : e.target.type === 'file' ? "file" : e.target.value
    setInventoryData(inventoryCrops)
  }

  async function confirmPostToFarmfresh() {
    const response = await sendToFarmFresh(inventoryData)
  }

  useEffect(() => {
    setLoading(true)
    getUserPlans(campaign.associatedPlan).then(res => {
      const data = res.data.requirements.filter(item => item.category === "crop")
      setCrops(data)
      setInventoryData(data)
    })

  }, [campaign])

  return (
    <>
      <Modal
        show={show}
        onHide={handleShow}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title className='inventory-to-farmfresh'>Finish Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Congratulations! Your campaign is finished. Below is a summary of your campaign.</p>
          {/* Maybe insert a contributions with time chart */}
          <p>Select the crops to post on FarmFresh. Note that the prices you set would be applicable for all consumers. Contributors would automatically be shown the discounted price as applicable</p>
          <Table className='w-100'>
            <thead>
              <tr>
                <th className=''>Crop</th>
                <th className='text-center'>Quantity<span className='text-center'><span className='d-table-cell d-lg-none'>/Unit</span><span className='d-table-cell d-lg-none'>/Photo</span><span className='d-table-cell d-sm-none'>/Price (KCO) per unit</span></span></th>
                <th className='d-none d-lg-table-cell'>Unit</th>
                <th className='d-none d-sm-table-cell'>Price (KCO) per unit</th>
                <th className='d-none d-lg-table-cell'>Photo</th>
              </tr>
            </thead>
            <tbody>
              {
                crops.map(crop => {
                  return (
                    <tr key={crop._id}>
                      <td>{crop.item}</td>
                      <td className='d-flex flex-column align-items-center justify-content-center p-2'>
                        <input className='mb-2' type="number" placeholder='Quantity' name={crop._id + "-" + "quantity"} onChange={handleCropsInfo} />
                        <select className='d-table-cell d-lg-none mb-2' defaultValue={'kilogram'} name={crop._id + "-" + "unit"} onChange={handleCropsInfo}>
                          <option value={'kilogram'}>{'(Kg)'}Kilogram</option>
                          <option value={'gram'}>{'(g)'}Gram</option>
                          <option value={'quintal'}>{'(q)'}Quintal</option>
                          <option value={'tonne'}>{'(ton)'}Tonne</option>
                          <option value={'Pounds'}>{'(lbs)'}Pounds</option>
                        </select>
                        <input className='d-block d-lg-none mb-2 w-75' type="file" name="cropImage"  onChange={(e) => handleCropImage(e.target.files[0], crop._id)} />
                        <td className='d-table-cell d-sm-none'><input type="number" placeholder='Price' name={crop._id + "-" + "price"} onChange={handleCropsInfo} /></td>
                      </td>
                      <td className='d-none d-lg-table-cell'>
                        <select defaultValue={'kilogram'} name={crop._id + "-" + "unit"} onChange={handleCropsInfo}>
                          <option value={'kilogram'}>{'(Kg)'}Kilogram</option>
                          <option value={'gram'}>{'(g)'}Gram</option>
                          <option value={'quintal'}>{'(q)'}Quintal</option>
                          <option value={'tonne'}>{'(ton)'}Tonne</option>
                          <option value={'Pounds'}>{'(lbs)'}Pounds</option>
                        </select>
                      </td>
                      <td className='d-none d-sm-table-cell'><input type="number" placeholder='Price' name={crop._id + "-" + "price"} onChange={handleCropsInfo} /></td>
                      <td className='d-none d-lg-table-cell'>
                        <input className='d-none d-lg-block w-100 mb-2' type="file" name="cropImage"  onChange={(e) => handleCropImage(e.target.files[0], crop._id)}  />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={()=>{}}>Save to Inventory</Button>
          <Button variant='success' onClick={confirmPostToFarmfresh}>Post Crops on FarmFresh</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function Campaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showContribute, setShowContribute] = useState(false);
  const [show, setShow] = useState(searchParams.get('launchcampaign') == 'true' ? true : false);
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

  const [farmfreshModal, setFarmfreshModal] = useState(false)
  const handleFarmfreshModal = () => {
    setFarmfreshModal(!farmfreshModal)
  }

  return (
    <div className='container'>
      <Helmet>
        <title>Campaigns | AgriTech</title>
      </Helmet>
      <div className='row shadow my-4 justify-content-around'>
        <div className='col-sm-3 p-3'>
          <Button variant="success" onClick={handleShow}>
            + Create Campaign
          </Button>
        </div>
        <div className='col-sm-3 p-3'>
          <Button variant="success" onClick={handleFarmfreshModal}>
            Push to FarmFresh
          </Button>
          <InventoryToFarmFreshModal campaign={{
            "_id": "648a22f2eff1092e874cd268",
            "title": "Help me Rebuild My Farm",
            "address": "0xc30dAEbBDa97156f0dA32A96b26639d6B7B7D18c",
            "target": 100000,
            "deadline": 1701289107,
            "minContri": 100,
            "associatedPlan": "648a207e0741a641f4ce8cfa",
            "description": "<p>Hello! My name is Rajesh, and I am a farmer from a small village in India. My family has been farming for generations, but our farm has fallen on tough times. I need your support to bring it back to life!</p><p>With your help, I want to make my farm better and more sustainable. I dream of using modern techniques like eco-friendly farming and renewable energy to grow healthy crops without harmful chemicals. This will not only benefit my family but also the entire community.</p><p><img src=\"https://im.rediff.com/money/2016/may/17farm.jpg?w=670&amp;h=900\"></p><p>By contributing to my crowdfunding campaign, you become a part of this exciting journey. Your support will provide resources and hope for my family and help us create a thriving farm. As a thank you, I am offering special rewards like fresh produce, farm tours, and more.</p><p><img src=\"https://static.toiimg.com/thumb/msid-58352995,width-1280,resizemode-4/58352995.jpg\"></p><p>Join me in making a positive change in our community. Your contribution, no matter how small, will make a big difference. Together, we can rebuild my farm, support local agriculture, and bring hope back to our village.</p><p>Thank you for believing in me and our shared future.</p><p>Best regards,</p><p>Rajesh</p>",
            "featuredImage": "https://picsum.photos/536/354",
            "manager": "645e43d4c8210259e8a62a13",
            "campaignTransactions": [],
            "dateCreated": "2023-06-14T20:28:34.048Z",
            "voteRequests": [],
            "contributors": [],
            "__v": 0,
            "pledges": []
          }} show={farmfreshModal} handleShow={handleFarmfreshModal} />
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
        <div className=''>
          {loading ? <>Loading...</>
            :
            userCampaigns?.length === 0 ? <>No campaigns created yet.</>
              :
              userCampaigns?.map((data, i) => {
                return (
                  <React.Fragment key={'campaignsKey' + i}>
                    {/* <button onClick={handleShowContribute} className='neumorph-btn-green'>Contribute</button> */}
                    <div className='widget shadow m-3'>
                      <CampaignWidgetV2 {...data} />
                    </div>
                    <ContributeModal
                      show={showContribute}
                      handleShow={handleShowContribute}
                      cid={data._id}
                      minContri={data.minContri}
                    />
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