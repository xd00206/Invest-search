require('dotenv').config();  // Load environment variables
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const { fetchTopPosts } = require('./reddit');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  console.log('Cleaning up resources...');
  // Add any resource cleanup logic here
});

// Fetch stock data from Alpha Vantage
ipcMain.handle('fetch-stock-data', async (event, symbol) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing. Please set it in your .env file.');
    }
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: apiKey,
      },
    });
    return response.data['Time Series (Daily)'];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
});

// Fetch top posts from Reddit
ipcMain.handle('fetch-reddit-posts', async (event, subreddit) => {
  try {
    const posts = await fetchTopPosts(subreddit);
    const serializedPosts = posts.map(post => ({
      title: post.title,
      score: post.score,
      url: post.url,
    }));
    return serializedPosts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
});
