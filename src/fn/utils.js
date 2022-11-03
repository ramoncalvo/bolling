import axios from "axios";
/*
     Calculating and plotting Bollinger Bands
     */
// Settings
const SMAverage = 20; // Simple Moving Average
const std = 2; // Standard deviation
const decimalsForStockName = {
  STL: 1,
  ABB: 5,
};

const callRangePrices = async (currency, from, to, interval) => {
  // currency DOGE-USD
  // from 1667282400
  // to 1667408400
  // interval 1d

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${currency}?symbol=${currency}&period1=${from}&period2=${to}&interval=${interval}&includePrePost=true&events=div%7Csplit`;
  axios
    .get(url)
    .then(function (response) {
      // handle success
      //   console.log(response);
      if (response.status === 200) {
        // if HTTP-status is 200-299
        // get the res body (the method explained below)
        let json = response.data.chart.result;
        console.log(json);
      } else {
        console.log("HTTP-Error: " + response.status);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};

const myMomentObject = (timestamp) => {
  callRangePrices("DOGE-USD", 1667282400, 1667408400, "1d");
  let momentUnix = moment(timestamp, "YYYY-MM-DD").unix();
  // console.log(timestamp, momentUnix);
  return momentUnix;
};

export const getDataSet = (label, url) => {
  myMomentObject("2021-10-16");
  // renderChart(label, url)
  // return url
};

const renderChart = (id, dataSet) => {
  // Taking out prices and putting into an array
  var stockPrices = dataSet.map((el) => el.last);

  // Generating object with arrays for each band
  let bBands = bollingerBands(stockPrices, SMAverage, std, id);

  // Generating x and y axis for stock prices
  var stockPrices = calculatePlotData(dataSet, false);

  // Generating x and y axis for Bollinger Bands
  var bollingerBandDataTop = calculatePlotData(dataSet, bBands.topBand);
  var bollingerBandDataMid = calculatePlotData(dataSet, bBands.midBand);
  var bollingerBandDataBot = calculatePlotData(dataSet, bBands.botBand);

  var context = document.querySelector("#" + id).getContext("2d");
  var stockChart = new Chart(context, {
    type: "line",
    data: {
      datasets: [
        {
          label: id,
          fill: false,
          data: stockPrices,
          pointRadius: 0,
          borderColor: "#1a41cc",
        },
        // Plotting additional data
        {
          label: "Top band",
          fill: false,
          data: bollingerBandDataTop,
          pointRadius: 0,
          borderColor: "#fe1ffe",
          borderWidth: 1,
        },
        {
          label: "SMA",
          fill: false,
          data: bollingerBandDataMid,
          pointRadius: 0,
          borderColor: "#a6a2ab",
          borderWidth: 2,
        },
        {
          label: "Bottom band",
          fill: false,
          data: bollingerBandDataBot,
          pointRadius: 0,
          borderColor: "#fe1ffe",
          borderWidth: 1,
        },
      ],
    },
    options: {
      animation: false,
      responsive: false,
      scales: {
        xAxes: [
          {
            type: "time",
            display: true,
          },
        ],
      },
    },
  });
};

function bollingerBands(avPricesArray, SMAverage, std, stockName) {
  // Daily moving average - center band.
  let midBand = [];
  // Standard deviations above the center band.
  let topBand = [];
  // Standard deviations below the center band.
  let botBand = [];
  // Array cannot be smaller than SMA-days count for average equation
  if (avPricesArray.length <= SMAverage) {
    throw "Data count is too small!";
  }

  // Getting decimals for stocks before entering the loop

  const decimals = decimalsForStockName[stockName];

  for (let i = 0; i <= avPricesArray.length; i++) {
    if (i < SMAverage) {
      // Filling arrays with nulls until it will be possible to
      // calculate beginning of the bands or SMA
      midBand.push(null);
      topBand.push(null);
      botBand.push(null);
    } else {
      // Cutting a portion of last SMA-number of results
      let workingArray = avPricesArray.slice(i - SMAverage, i);

      // Calculates standard deviation of SMA-number of results
      let standardDeviation = math.std(workingArray);

      // Calculating moving average which is a total sum of last SMA-number of results
      // divided by SMA-number of results
      let midPoint = workingArray.reduce(sumOfArray) / workingArray.length;

      // Calculating top and bottom point of Bollinger Bands
      let topPoint = midPoint + standardDeviation * std;
      let botPoint = midPoint - standardDeviation * std;

      // Adding results to arrays and fixing decimals
      midBand.push(midPoint.toFixed(decimals));
      topBand.push(topPoint.toFixed(decimals));
      botBand.push(botPoint.toFixed(decimals));
    }
  }

  return {
    midBand: midBand,
    topBand: topBand,
    botBand: botBand,
  };
}

/*
      Generating x and y values for original and new data.
      */
function calculatePlotData(initialData, additionalData) {
  var chartData = initialData.map(function (item, index, array) {
    return {
      x: new Date(item.date).toISOString(),
      y: additionalData ? additionalData[index] : item.last,
    };
  });
  return chartData;
}

// Helper function for a reducer
function sumOfArray(total, num) {
  return total + num;
}
