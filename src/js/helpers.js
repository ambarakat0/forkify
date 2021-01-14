import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js'


const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

// fetch return promise so we can use it inside async await function
// json() is a method found in response object which return from fetch function
// json() return a promise
export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),
        }) : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;

    } catch (err) {
        // rethrow the err cuz we want to handle error in model.js not here and the promise will be reject
        // if we handle it here the promise get from getJSON we be fullfiled
        throw err;
    }
}

/*
export const getJSON = async function (url) {
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;

    } catch (err) {
        // rethrow the err cuz we want to handle error in model.js not here and the promise will be reject
        // if we handle it here the promise get from getJSON we be fullfiled
        throw err;
    }
}

export const sendJSON = async function (url, uploadData) {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),
        });

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;

    } catch (err) {
        // rethrow the err cuz we want to handle error in model.js not here and the promise will be reject
        // if we handle it here the promise get from getJSON we be fullfiled
        throw err;
    }
}
*/