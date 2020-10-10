'use strict';
const ytlist = require('youtube-playlist');


module.exports.getChannelVideos = async event => {
  try {
    // const channelOrPlaylistId = 'UCCMC_4hcI9zoOvjSfka0-xQ';
    const channelOrPlaylistId = (event.queryStringParameters || {}).id;
    console.log(channelOrPlaylistId);
    const url = `https://www.youtube.com/channel/${channelOrPlaylistId}/videos`;
    const response = await ytlist(url, 'url');

    console.log(response);

    return {
      statusCode: 200,
      body: JSON.stringify([])
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify([err.message])
    }   
  }
};
