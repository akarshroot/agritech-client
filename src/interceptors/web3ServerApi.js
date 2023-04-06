import axios from "axios";

const funUrl = '/web3/fundingContracts/'
const web3Url = '/web3/wallet/'

async function getBalance(acc) {
    const res = await axios.get(web3Url + "getBalance/" + acc)
    return res.data
}

async function createCampaign(data) {
    const res = await axios.post(funUrl + 'deployContract/', data)
    return res.data
}
async function transferKCO(data) {
    const res = await axios.post(web3Url + 'transfer', data)
    return res.data
}

async function contribute(data) {
    const res = await axios.post(funUrl + 'contribute', data)
    return res.data
}
async function getApproval(data) {
    const res = await axios.post(funUrl + 'getApproval', data)
    return res.data
}

export {
    getBalance,
    createCampaign,
    transferKCO,
    contribute,
    getApproval,
}