const Chart = window.api.Chart;

// Initialize chart variable to store the chart instance
let stockChart;

document.getElementById('stockForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const symbol = document.getElementById('symbol').value;
  console.log(`Fetching stock data for symbol: ${symbol}`);
  const data = await window.api.fetchStockData(symbol); // Ensure we call the API method exposed via preload.js

  if (data) {
    const latestDates = Object.keys(data).reverse();
    const latestPrices = latestDates.map(date => data[date]['4. close']);

    // Destroy the previous chart instance if it exists
    if (stockChart) {
      stockChart.destroy();
    }

    // Create a new chart
    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: latestDates,
        datasets: [{
          label: `${symbol} Closing Prices`,
          data: latestPrices,
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      }
    });

    console.log(`Stock data for ${symbol}:`, latestPrices);
  } else {
    document.getElementById('result').innerHTML = `<p>Failed to fetch data for ${symbol}</p>`;
  }
});

// Fetch and display Reddit posts
(async () => {
  const subreddits = ['wallstreetbets', 'Options', 'Stocks', 'Investing', 'QQQ'];
  const allPosts = [];

  for (const subreddit of subreddits) {
    try {
      const posts = await window.api.fetchRedditPosts(subreddit); // Ensure we call the API method exposed via preload.js
      if (posts.length > 0) {
        allPosts.push(...posts);
      }
    } catch (error) {
      console.error(`Error fetching posts from subreddit ${subreddit}:`, error);
    }
  }

  const redditPostsDiv = document.getElementById('reddit-posts');
  if (allPosts.length > 0) {
    allPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.innerHTML = `<a href="${post.url}" target="_blank">${post.title}</a> (Score: ${post.score})`;
      redditPostsDiv.appendChild(postElement);
    });
    console.log('All posts fetched:', allPosts);
  } else {
    redditPostsDiv.innerHTML = '<p>No posts found or an error occurred.</p>';
  }
})();
