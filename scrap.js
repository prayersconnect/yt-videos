const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const getURLContents = async (url) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  console.log('url', url);

  await page.goto(url);

  const html = await page.content();
  browser.close();
  return html;

}

const parseVideos = (response) => {
  const dom = cheerio.load(response);

  let videos = [];
  dom('ytd-grid-video-renderer .yt-simple-endpoint').each((_idx, el) => {
    const video = dom(el).attr('href');
    videos.push(video.replace('/watch?v=', ''));
  });

  return videos;
}

const getChannelVideos = async (channelId)  => {
  const url = `https://www.youtube.com/channel/${channelId}/videos`;
  
  const videos = parseVideos(await getURLContents(url));

  console.log('video list', videos);

}

getChannelVideos('UCCMC_4hcI9zoOvjSfka0-xQ');