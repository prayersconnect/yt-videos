'use strict';
const scraper = require('./scrap');

module.exports.getChannelVideos = async event => {
  try {
    // const channelOrPlaylistId = 'UCCMC_4hcI9zoOvjSfka0-xQ';
    const channelOrPlaylistId = (event.queryStringParameters || {}).id;
    console.log(channelOrPlaylistId);
    const videos = await scraper.getChannelVideos(channelOrPlaylistId);

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify([err.message])
    }   
  }
};
