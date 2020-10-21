const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const iPhone = puppeteer.devices['iPhone X'];
const { Youtube } = require('scrape-youtube');
const youtube = new Youtube();

const showMoreButtonSelector = 'c3-next-continuation button';
const spinnerSelector = 'c3-next-continuation .spinner.nextcontinuation-spinner';
const videoLinkSelector = 'ytm-compact-video-renderer .compact-media-item-metadata-content';

const loadMorePages = async(page, maxPage) => {
  const maxAllowedPage = maxPage > 99 ? 99 : maxPage;

  for(let currentPage = 1; currentPage < maxAllowedPage; currentPage++) {
    console.log('Getting page', currentPage + 1);
    const showMoreElem = await page.$(showMoreButtonSelector);
    if(showMoreElem){
      await showMoreElem.click();
      await new Promise((resolve) => setTimeout(resolve, 400));
      await page.waitForSelector(spinnerSelector, {hidden: true})
    } else {
      break; //break the loop
    }
  }

  // require('fs').writeFileSync('./list.html', await page.content());

  return page;
}
const getURLContents = async (url, maxPage = 1) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.emulate(iPhone);

  console.log('Getting page', 1);
  await page.goto(url);

  await loadMorePages(page, maxPage === 'all' ? 99 : maxPage);

  const html = await page.content();
  browser.close();
  return html;

}

const parseVideos = (response) => {
  const dom = cheerio.load(response);

  let videos = [];
  dom(videoLinkSelector).each((_idx, el) => {
    const video = dom(el).attr('href');
    videos.push(video.replace('/watch?v=', ''));
  });

  return videos;
}

const getChannelVideos = async (channelId, maxPage)  => {
  const url = `https://m.youtube.com/channel/${channelId}/videos`
  const videos = parseVideos(await getURLContents(url, maxPage));
  console.log('video list', videos, `Total ${videos.length} videos`);

  const videoDetails = videos.forEach(async (videoId) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`
  const videoDetail =  await youtube.searchOne(url)
  console.log('video detail', videoDetail)

  return videoDetails;
}
)}


const getUserVideos = async (userId, maxPage)  => {
  const url = `https://m.youtube.com/c/${userId}/videos`;
  // https://m.youtube.com/channel/UCCMC_4hcI9zoOvjSfka0-xQ/videos
  const videos = parseVideos(await getURLContents(url, maxPage));

  console.log('video list', videos, `Total ${videos.length} videos`);

  return videos;
}

getChannelVideos('UCCMC_4hcI9zoOvjSfka0-xQ', 5);
// getUserVideos('ValleyRanchIslamicCenter', 5);

module.exports = {
  getChannelVideos,
  getUserVideos
}
