'use strict';
const scraper = require('./scrap');
const ytch = require('yt-channel-info');

module.exports.getVideoList = async event => {
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


module.exports.getVideoDetails = async event => {
  try {
    console.log(`Function version: ${process.env.AWS_LAMBDA_FUNCTION_VERSION}`);
    const videoId = (event.queryStringParameters || {}).id;
    console.log('videoId', videoId);

    return {
      statusCode: 200,
      body: JSON.stringify(await scraper.getVideoDetails([videoId]))
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify([err.message])
    }
  }
};