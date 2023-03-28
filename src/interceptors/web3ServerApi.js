import axios from "axios";

const funUrl = '/web3/fundingContracts/'
const web3Url = '/web3/wallet/'

async function getBalance(acc){
    const res = await axios.get(web3Url+"getBalance/"+acc)
    return res.data
}

export {
    getBalance
}