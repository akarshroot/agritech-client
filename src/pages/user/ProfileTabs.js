import React, { useState, useEffect, useRef } from 'react'
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useUser } from '../../context/UserContext'
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { LuDelete } from 'react-icons/lu'
import { renderWidget } from '../../assets/widgets/Widgets';

function ProfileTabs() {

    const { userData } = useUser()
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cropsSown, setCropsSown] = useState([])
    const [editStatus, setEditStatus] = useState(false)
    const [personalDetails, setPersonalDetails] = useState({
        email: userData?.email,
        phno: userData?.phno
    })

    const [agriDetails, setAgriDetails] = useState({
        landArea: userData?.landArea,
        region: userData?.region,
    })

    const crops = useRef()

    function changeEditStatus(e) {
        e.preventDefault()
        if (editStatus) {
            setEditStatus(false)
        }
        else {
            setEditStatus(true)
        }
    }

    function editPersonalDet(e) {
        console.log(personalDetails)
        setPersonalDetails((prev) => {
            return ({
                ...prev,
                [e.target.name]: e.target.value
            })
        })
    }

    function editAgriDetails(e) {
        console.log(agriDetails)
        setAgriDetails((prev) => {
            return (
                {
                    ...prev,
                    [e.target.name]: e.target.value
                }
            )
        })
    }

    useEffect(() => {
        console.log(selectedCountry);
        console.log(selectedCountry?.isoCode);
        console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
    }, [selectedCountry]);

    function addCrops(e) {
        e.preventDefault()
        let cropsArr = crops.current.value.split(',')
        setCropsSown([...cropsSown, ...cropsArr])
    }

    function delCrop(e, deletedcrop) {
        e.preventDefault()
        console.log(deletedcrop)
        let filteredCrops = cropsSown.filter((crop) => {
            if (crop != deletedcrop) {
                return true;
            }
        })

        setCropsSown(filteredCrops)
    }

    return (
        <Tab.Container id="left-tabs-example" className='profile-left-tabs w-100' defaultActiveKey="first">
            <Row>
                <Col>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item className='profile-tab-item'>
                            <Nav.Link className='profile-tab-link' eventKey="first">Personal Details</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='profile-tab-link' eventKey="second">Agricultural Details</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {renderWidget("profile-completion")}
                </Col>
                <Col md={5}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <form className='profile-form'>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor="profile-name">Name : </label>
                                    <input
                                        type="text"
                                        className='profile-name profile-ip' id="profileName" value={userData?.name} placeholder='Enter your name'
                                        disabled={true}
                                    />
                                    <br></br>

                                </div>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor="profile-email">Email : </label>
                                    <input
                                        type="email"
                                        className='profile-email profile-ip'
                                        value={editStatus ? personalDetails?.email : userData?.email} id="profileEmail"
                                        name="email"
                                        onChange={
                                            (e) => {
                                                editPersonalDet(e)
                                            }
                                        }
                                        placeholder='Enter your email'
                                        disabled={!editStatus}
                                    />
                                    <br></br>

                                </div>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor="profile-phno">Mobile :</label>
                                    <input
                                        type="number"
                                        className='profile-phno profile-ip'
                                        id="profilePhno"
                                        name="phno"
                                        value={editStatus ? personalDetails?.phno : userData?.phno}
                                        onChange={
                                            (e) => {
                                                editPersonalDet(e)
                                            }
                                        }
                                        placeholder='Enter your Mobile Number'
                                        disabled={!editStatus}
                                    />
                                    <br></br>

                                </div>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor="profile-about">About :</label>
                                    <textarea
                                        rows="5"
                                        cols="35"
                                        id="profile-about"
                                        placeholder='Tell us about yourself'
                                        className='profile-about  profile-ip'
                                        disabled={!editStatus}
                                    />
                                    <br></br>

                                </div>
                                <div className='profile-label-ip react-select-tags'>
                                    <label className='profile-label' htmlFor='profile-country'>Country :</label>
                                    <Select
                                        className='profile-ip'
                                        id="profile-country"
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCountry}
                                        onChange={(item) => {
                                            setSelectedCountry(item);
                                        }}
                                        placeholder="Select Country"
                                    />
                                </div>

                                <div className='profile-label-ip react-select-tags'>
                                    <label className='profile-label' htmlFor='profile-state'>State :</label>
                                    <Select className='profile-ip' id="profile-state"
                                        options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedState}
                                        onChange={(item) => {
                                            setSelectedState(item);
                                        }}
                                        placeholder="Select State"
                                    />

                                </div>
                                <div className='profile-label-ip react-select-tags'>
                                    <label className='profile-label' htmlFor='profile-city'>City :</label>
                                    <Select className='profile-ip' id="profile-city"
                                        options={City.getCitiesOfState(
                                            selectedState?.countryCode,
                                            selectedState?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedCity}
                                        onChange={(item) => {
                                            setSelectedCity(item);
                                        }}
                                        placeholder="Select City"
                                    />
                                </div>
                                <div className='profile-label-ip'>
                                    <div className='profile-label-ip'>
                                        <label className='profile-label' htmlFor="profile-pincode">Pincode :</label>
                                        <input
                                            type="number"
                                            className='profile-pincode profile-ip'
                                            id="profile-pincode"
                                            placeholder='Enter your pincode'
                                            disabled={!editStatus}
                                        />
                                        <br></br>

                                    </div>
                                </div>

                                {
                                    editStatus ? <button className="profile-btn" onClick={changeEditStatus}>Save</button> : <button className='profile-btn' onClick={(e) => {
                                        changeEditStatus(e)
                                    }}>Edit Profile</button>
                                }
                            </form>
                        </Tab.Pane>
                        {/* land area - float, region - textbox, crops - textbox, images */}
                        <Tab.Pane eventKey="second">
                            <form className='profile-form'>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor='landArea'>Land Area(in heactares) :</label>
                                    <input
                                        type="float" className='profile-ip' placeholder='Enter land area in heactares'
                                        value={editStatus ? agriDetails?.landArea : userData?.landArea} onChange={(e) => { editAgriDetails(e) }}
                                        name="landArea"
                                        disabled={!editStatus}
                                    />
                                </div>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor='landRegion'>Land Region :</label>
                                    <input
                                        type="text" className='profile-ip' placeholder="Enter your land's region"
                                        value={editStatus ? agriDetails?.region : userData?.region} onChange={(e) => { editAgriDetails(e) }}
                                        name="region"
                                        disabled={!editStatus} />
                                </div>
                                <div className='profile-label-ip'>
                                    <label className='profile-label' htmlFor="crops">Crops :</label>
                                    <input
                                        type="text"
                                        ref={crops} className='profile-ip' placeholder='Enter the crop(s) you sow' disabled={!editStatus} /><button className='add-crop-btn' onClick={(e) => {
                                            addCrops(e)
                                        }}
                                            disabled={!editStatus}>
                                        Add
                                    </button>
                                </div>
                                <div className='profile-label-ip'>
                                    {
                                        cropsSown.length == 0 ? <p>No crops added yet!</p> : cropsSown.map((data) => {
                                            return (
                                                <li className='crops-list'>{data} <button className="crop-del-btn" onClick={(e) => {
                                                    delCrop(e, data)
                                                }}><LuDelete className='delete-crop-icon' /></button></li>
                                            )
                                        })
                                    }
                                </div>
                                <div className='image-gallery profile-label-ip'>
                                    <label className='profile-label' htmlFor="field-img">Add image :</label>
                                    <input type="file" id="field-img" className='profile-ip'
                                        disabled={!editStatus}
                                    />
                                    <div className='grid-container'>
                                        <div><img loading='lazy' className='grid-item grid-item-1' src="https://images.pexels.com/photos/4737484/pexels-photo-4737484.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" /></div>
                                        <div><img loading='lazy' className='grid-item grid-item-2' src="https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg" /></div>
                                        <div><img loading='lazy' className='grid-item grid-item-3' src="https://api.contentstack.io/v2/assets/575e4d1c0342dfd738264a1f/download?uid=bltada7771f270d08f6" /></div>
                                        <div><img loading='lazy' className='grid-item grid-item-4' src="https://helpx.adobe.com/content/dam/help/en/photoshop/using/matching-replacing-mixing-colors/jcr_content/main-pars/before_and_after/image-after/match-outcome3.png" /></div>
                                        <div><img loading='lazy' className='grid-item grid-item-5' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8g0hSiA0eoOfogf7XDpaQLwEXnw1uptrPr1flLm6FnMeyLaJcAUykLNdsb7j5fJ7S-su4c-VYOZs&usqp=CAU&ec=48600113" /></div>
                                        <div>
                                            <img loading='lazy' class='grid-item grid-item-6' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjz6-e5lR2rdUsPC1_wnaEwSDWXJIp0sbB7hf12Zx1Qg&usqp=CAU&ec=48600113' alt='' />
                                        </div>
                                        <div>
                                            <img loading='lazy' class='grid-item grid-item-7' src='https://wallpaperaccess.com/full/1956710.png' alt='' />
                                        </div>
                                    </div>
                                    <div className='profile-label-ip'>

                                        {
                                            editStatus ? <button className="profile-btn" onClick={(e) => {
                                                changeEditStatus(e)
                                            }}>Save</button> : <button className="profile-btn" onClick={(e) => {
                                                changeEditStatus(e)
                                            }}>Edit Profile</button>
                                        }
                                    </div>
                                </div>
                            </form>
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
                <Col>
                    <div className='profile-img'>
                        <div className='profile-card-body'>
                            <div className='user-profile-img'>
                                <img loading='lazy' src={userData?.imgUrl} />
                            </div>
                            <div className='joined-platform'>
                                <p><i>Joined on {new Date(userData?.createdAt).toLocaleString()}</i></p>
                                <p className='user-bio'><i>//Bio Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis sollicitudin quam, id tincidunt libero cursus at. Duis condimentum, nunc at tincidunt placerat, nunc nunc consectetur lectus, vitae pulvinar leo tellus tincidunt libero.</i></p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default ProfileTabs