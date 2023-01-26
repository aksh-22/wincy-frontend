import axios from 'axios';
import { axiosError } from './axiosError';
import store from 'redux/store';
const axiosInstance = axios.create({
    // baseURL: `https://wincy-backend.herokuapp.com`, //live
    // baseURL: `https://lazy-red-macaw-tie.cyclic.app/`, //live
    baseURL: `http://localhost:3001/`,
    // baseURL: `https://wincy-staging-cy.cyclic.app/`,

    // baseURL: `https://wincy-staging.herokuapp.com`,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(function (config) {
    let reduxStore = store.getState();
    let token = reduxStore?.userReducer?.userData?.token;
    // console.log(" === 232 interceptors access_token ===", token);
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});
// Add a response interceptor
axiosInstance.interceptors.response.use(
    (res) => {
        // successToast("Success");
        store.dispatch({
            type: 'SESSION_EXPIRED',
            payload: false,
        });
        return res;
    },
    (err) => axiosError(err)
);
export { axiosInstance };