import axios from 'axios'

//Node Server URL
const MAIN_URL = "http://localhost:8800/api"

//Node Server Request and Response Functions

export function login(data){
    return axios.post(`${MAIN_URL}/login`,data)
}

export function addUser(data){
    return axios.post(`${MAIN_URL}/register`,data)
}

export function addCompany(data){
    return axios.post(`${MAIN_URL}/company-details`,data,{})
}

export function fetchCompany(data){
    return axios.post(`${MAIN_URL}/fetch-company-details`,data)
}

export function authenticateUser(data){
    return axios.get(`${MAIN_URL}/authenticate-user`,{headers:{"Authorization":`Bearer ${data.token}`}})
}

export function fetchUser(data){
    return axios.post(`${MAIN_URL}/fetch-user`,data)
}

export function addInvoiceDetails(data){
    return axios.post(`${MAIN_URL}/add-invoice-details`,data)
}

export function fetchInvoiceDetails(data){
    return axios.post(`${MAIN_URL}/fetch-invoice-details`,data)
}

export function deleteInvoiceDetails(data){
    return axios.post(`${MAIN_URL}/delete-invoice-details`,data)
}

export function changeInvoiceStatus(data){
    return axios.post(`${MAIN_URL}/change-invoice-status`,data)
}

export function sendDocument(data){
    console.log("Node working")
    return axios.post(`${MAIN_URL}/submit-pdf`,data)
}

export function sendmailerdata(data){
    return axios.post(`${MAIN_URL}/sender-mail-details`,data)
}