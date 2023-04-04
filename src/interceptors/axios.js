import axios from "axios";

axios.defaults.baseURL = '/api/';

// let refresh = false;
let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    const prevReq = error?.config
    if ((error.response.status === 403 || error.response.status === 401) && !refresh) {
        // refresh = true;
        const response = await axios.post('refreshToken', {});
        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`;
            prevReq.headers['Authorization'] = `${response.data['accessToken']}`;
            return axios(prevReq);
        }
    }
    // refresh = false;
    return error;
});