'use strict';
const scraper = require('./scrap');

module.exports.getVideoList = async event => {
  try {
    console.log(`Function version: ${process.env.AWS_LAMBDA_FUNCTION_VERSION}`);
    const channelOrUser = (event.queryStringParameters || {}).id;
    const maxPages = (event.queryStringParameters || {}).max_pages;

    if(!channelOrUser) {
      throw new Error('You must provide channel/user id!')
    }

    const videos = await scraper.getVideos(channelOrUser, maxPages);

    console.log('total', videos.length);
    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err instanceof Error ? err.message : JSON.stringify(err)
    }
  }
};

