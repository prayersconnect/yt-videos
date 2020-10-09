'use strict';

module.exports.getChannelVideos = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      [{
        id: 'foo',
        title: 'foo video',
        description: 'foo description',
        thumbnail: '',
        duration: 60,
        isLive: false,
      }],
      null,
      2
    ),
  };
};
