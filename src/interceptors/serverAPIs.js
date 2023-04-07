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

export {
    getAllCamps,
    getCampbyId,
    getCollectonCampbyId
}