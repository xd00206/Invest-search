const Snoowrap = require('snoowrap');

const reddit = new Snoowrap({
  userAgent: 'Informed Data',
  clientId: 'zvrq_RPHMVuf4-1AcxJuRg',
  clientSecret: 'irriXnOymigenJCjr9K1-pr_5p5P3Q',
  refreshToken: '120980247697452-ZuzZs7X36RGYl5uQ4UbjeJZ2flLjZw',
});

async function fetchTopPosts(subreddit) {
  try {
    const posts = await reddit.getSubreddit(subreddit).getTop({ time: 'day', limit: 5 });
    return posts.map(post => ({
      title: post.title,
      score: post.score,
      url: post.url,
    }));
  } catch (error) {
    console.error(`Error fetching posts from ${subreddit}:`, error);
    return [];
  }
}

module.exports = { fetchTopPosts };
