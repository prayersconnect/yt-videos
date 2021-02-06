const ytch = require('yt-channel-info');

function parseVideo(details) {

  // console.log('details', details);
  const thumbnail = details.videoThumbnails.sort((vid1, vid2) => vid2.width - vid1.width)[0];

  return {
    title: details.title,
    description: null,
    duration: details.lengthSeconds,
    thumbnail: thumbnail.url,
    link: `https://www.youtube.com/watch?v=${details.videoId}`
  }
}

const getVideos = async (channelOrUserId, maxPage) => {
  const videos = await ytch.getChannelVideos(channelOrUserId, 'newest');
  return videos.items.filter((vid) => vid.authorId === channelOrUserId).map(parseVideo);
}

if (require.main === module) {
  (async () => {
    console.log(await getVideos('UCCMC_4hcI9zoOvjSfka0-xQ', 1));
  })()
}

module.exports = {
  getVideos
}
