import axios from "axios";

const funUrl = '/web3/fundingContracts/'

async function getAllCamps() {
    const res = await axios.get(funUrl)
    return res.data
}
async function getCampbyId(id) {
    const res = await axios.get(funUrl + id)
    return res.data
}
async function getCollectonCampbyId(id) {
    const res = await axios.get(funUrl + "raised/"+ id)
    if(res.hasOwnProperty("data")) return res.data
    else throw new Error("Internal Server Error")
}
async function getUserPlans() {
    try {
        const response = await axios.get("/management/plan/all")
        if (response.hasOwnProperty("data"))
            return response.data
        else throw response.response.data
    } catch (error) {
        return error
    }
  }
export {
    getAllCamps,
    getCampbyId,
    getCollectonCampbyId,
    getUserPlans
}