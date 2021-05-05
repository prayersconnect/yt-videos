const ytch = require('yt-channel-info');
const utf8 = require('utf8');

function parseVideo(details) {
  const thumbnail = details.videoThumbnails.sort((vid1, vid2) => vid2.width - vid1.width)[0];

  return {
    id: details.videoId,
    title: utf8.encode(details.title, 'utf-8'),
    description: null,
    duration: details.lengthSeconds,
    thumbnail: thumbnail.url,
    link: `https://www.youtube.com/watch?v=${details.videoId}`
  }
}

const getVideos = async (channelOrUserId, maxPage = 1) => {
  let videos = []
  let currentPage = 1;
  let continuation = null;

  while(currentPage <= maxPage) {
    console.log(`Retrieving page ${currentPage} of ${maxPage} for ${channelOrUserId}`, continuation)
    let pageResult;
    if(continuation) {
      pageResult = await ytch.getChannelVideosMore(continuation);
    } else {
      pageResult = await ytch.getChannelVideos(channelOrUserId, 'newewst');
    }
    // console.error('pageResult', pageResult.items);
    videos = videos.concat(pageResult.items);

    continuation = pageResult.continuation;
    currentPage++;
  }

  return videos.map(parseVideo);
}

if (require.main === module) {
  (async () => {
    console.log(await getVideos('UCCMC_4hcI9zoOvjSfka0-xQ', 1));
  })()
}

module.exports = {
  getVideos
}
