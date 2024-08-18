const { contextBridge, ipcRenderer } = require('electron');
const Chart = require('chart.js/auto');
require('chartjs-adapter-moment');

// Expose methods and modules to the renderer process in a secure manner
contextBridge.exposeInMainWorld('api', {
  // Fetch stock data by symbol
  fetchStockData: async (symbol) => {
    try {
      return await ipcRenderer.invoke('fetch-stock-data', symbol);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  },
  
  // Fetch Reddit posts from a subreddit
  fetchRedditPosts: async (subreddit) => {
    try {
      return await ipcRenderer.invoke('fetch-reddit-posts', subreddit);
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
      return [];
    }
  },

  // Expose Chart.js to the renderer process
  Chart: Chart
});


