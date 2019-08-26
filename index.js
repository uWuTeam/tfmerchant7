const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const moment = require('moment');
const fs = require('async-file');
const generate = require('./lib/generate');
const uuidv4 = require('uuid/v4');
var uuid = uuidv4();

const functionQr = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/explore';

    const boday = {"data":"{\"activity\":\"GP:MT\",\"data\":{\"receiverid\":\"dcd13153-7502-411b-98ca-4c844ce2679c\"}}","type":"QR_CODE"};

    fetch(url, {
        method: 'POST',
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })

});

const functionIsi = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/payment';

    const boday = {"amount":15000,"metadata":{"tags":"{ \"service_type\": \"GOPAY_OFFLINE\" }","channel_type":"STATIC_QR","merchant_cross_reference_id":"dcd13153-7502-411b-98ca-4c844ce2679c","external_merchant_name":"Dimas Cell"},"payment_request_type":"STATIC_QR","receiver_payment_handle":"dcd13153-7502-411b-98ca-4c844ce2679c"};
    fetch(url, {
        method: 'POST',
        headers: {
            'pin':'',
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })
});

const functionSukses = (reffId, accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/payment?action=fulfill';

    const boday = {
        "promotion_ids":[],
        "reference_id":reffId,
        "token":"eyJ0eXBlIjoiR09QQVlfV0FMTEVUIiwiaWQiOiIifQ=="
    };
    fetch(url, {
        method: 'PATCH',
        headers: {
            'pin': '121212',
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })

});

(async () => { 
	try {
		const uniqueid = generate.genUniqueId(16);
		await fs.readFile('token.txt','utf8', async(err, data) => {
            if (err) throw err;
            array = data
            .toString()
            .replace(/\r\n|\r|\n/g, " ")
            .split(" ")

            for (i in array) {
                const accessToken = array[i];
                const qr = await functionQr(accessToken, uuid, uniqueid);
		        const isi = await functionIsi(accessToken, uuid, uniqueid);
		        const reffId = await isi.data.reference_id;
		        const tf = await functionSukses(reffId, accessToken, uuid, uniqueid);
		        const id = await tf.data.transaction_ref;
		        console.log(colors.success(`[ ${moment().format('HH:mm:ss')} ] Transaksi Ke Merchant Dimas Cell - Jumlah 15.000 - Transaction ID: `+id));
            }
        });
	} catch (e) {
		console.log(e)
	}
})();