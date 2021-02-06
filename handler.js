'use strict';
const scraper = require('./scrap');

module.exports.getVideoList = async event => {
  // try {
    console.log(`Function version: ${process.env.AWS_LAMBDA_FUNCTION_VERSION}`);
    const channelOrUser = (event.queryStringParameters || {}).id;
    const maxPages = (event.queryStringParameters || {}).max_pages;

    const videos = await scraper.getVideos(channelOrUser, maxPages);

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  // } catch (err) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify(err.message)
  //   }
  // }
};

