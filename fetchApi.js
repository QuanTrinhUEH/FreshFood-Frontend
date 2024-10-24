const API_URL = 'https://freshfood-backend-tdz9.onrender.com'
export const fetchAPI = async (endpoint, method, bodyData, token) => {
    const response = await fetch(API_URL + endpoint, {
        method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? "Token " + token : ""
        },
        body: JSON.stringify(bodyData)
    })
    const data = await response.json();
    return data
}
export const fetchAPIWithoutBody = async (endpoint, method, token) => {
    const response = await fetch(API_URL + endpoint, {
        method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? "Token " + token : ""
        },
    })
    const data = await response.json();
    return data
}
export const fetchIMG = async (endpoint, method, bodyData, token) => {
    console.log(bodyData);
    const response = await fetch(API_URL + endpoint, {
        method,
        mode: "cors",
        headers: {
            "Authorization": token ? "Token " + token : "Token"
        },
        body: bodyData
    })
    const data = await response.json();
    return data
}
export const refreshTokenResetter = async (endpoint, method, token) => {
    const response = await fetch(API_URL + endpoint, {
        method,
        mode: "cors",
        headers: {
            "Authorization": "Token " + token
        }
    })
    const data = await response.json();
    return data
}