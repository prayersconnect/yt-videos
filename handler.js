'use strict';
const scraper = require('./scrap');

module.exports.getChannelVideos = async event => {
  try {
    console.log(`Function version: ${process.env.AWS_LAMBDA_FUNCTION_VERSION}`);
    const channelOrUser = (event.queryStringParameters || {}).id;
    const maxPages = (event.queryStringParameters || {}).max_pages;
    const kind = (event.queryStringParameters || {}).type;

    console.log('params', channelOrUser, maxPages, kind);

    let videos;
    if (kind === 'user') {
      videos = await scraper.getUserVideos(channelOrUser, maxPages);
    } else {
      videos = await scraper.getChannelVideos(channelOrUser, maxPages);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify([err.message])
    }
  }
};
