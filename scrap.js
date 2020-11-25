const ytch = require('yt-channel-info');
const { Youtube } = require('scrape-youtube');


const getChannelVideos = async (channelId, maxPage) => {
  const videos = await ytch.getChannelVideos(channelId, 'newest');
  return videos.items.map((vid)=>vid.videoId);
}

const getUserVideos = async (userId, maxPage) => {
  const url = `https://m.youtube.com/c/${userId}/videos`;
  const videos = parseVideos(await getURLContents(url, maxPage));

  console.log('video list', videos, `Total ${videos.length} videos`);

  return videos;
}

const getVideoDetails = async(videos = []) => {
  const youtube = new Youtube();
  return await Promise.all(videos.map(async (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`
    const videoDetail =  await youtube.searchOne(url)
    // console.log('video detail:', videoDetail)
    return videoDetail;
  }));
}

if (require.main === module) {
  (async() => {
      // getUserVideos('ValleyRanchIslamicCenter', 5);
    console.log(await getChannelVideos('UCCMC_4hcI9zoOvjSfka0-xQ', 1));

    // const details = await getVideoDetails(['qSP_BP-pM4w', 'ra-5KkKrbXg', '-7DHxq4PBoQ', 'zZgcOpJOAWo']);
    // console.log('details', details);
  })()


}

module.exports = {
  getChannelVideos,
  getUserVideos,
  getVideoDetails
}
