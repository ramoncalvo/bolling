import axios from 'axios'
const callRangePrices = async (currency, from, to, interval) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${currency}?symbol=${currency}&period1=${from}&period2=${to}&interval=${interval}&includePrePost=true&events=div%7Csplit`

    // let res = await fetch(url);
    axios.get(url)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

    if (res.ok) { // if HTTP-status is 200-299
        // get the res body (the method explained below)
        // let json = await res.json();
        console.log(json)
    } else {
        console.log("HTTP-Error: " + res.status);
    }
}

callRangePrices('DOGE-USD', 1667282400, 1667408400, '1d')