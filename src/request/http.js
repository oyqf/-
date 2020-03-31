import axios from 'axios'
import QS from 'qs'
import { Toast } from 'vant'; 

   
//axios.defaults.baseURL = 'http://192.168.8.89:3980';s
//axios.defaults.baseURL = "http://192.168.2.181:25776/Phone"
axios.defaults.baseURL = "http://report.hhsyl.com/Home"

axios.defaults.timeout = 10000;

// axios.interceptors.request.use(
//     response => {
//         return response
//     },
//     error => {
//         console.log(error);
//         Toast({
//             message: '请求超时',
//             position: 'middle',
//             duration: 1000
//         })
//         return Promise.reject(err)}
// )

// axios.interceptors.response.use(
//     response => {
//         return response
//     },
//     error => {
//         console.log(error.response)
//         return Promise.reject(error)
//     }
// )

export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

export function post(url, params) {
    return new Promise((resolve, reject) => {
         axios.post(url, QS.stringify(params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });}




