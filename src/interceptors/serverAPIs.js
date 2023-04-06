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
    return res.data
}

export {
    getAllCamps,
    getCampbyId,
    getCollectonCampbyId
}