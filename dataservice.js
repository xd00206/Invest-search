const axios = require('axios');

const API_KEY = 'K1GNFK84OQ1UGTF5';

async function getStockData(symbol) {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                apikey: API_KEY
            }
        });

        const data = response.data['Time Series (Daily)'];
        return data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

module.exports = {
    getStockData
};

