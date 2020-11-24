const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const cheerio = require('cheerio');
const iPhone = puppeteer.devices['iPhone X'];
const youtube = require('scrape-youtube');


const showMoreButtonSelector = 'c3-next-continuation button';
// const spinnerSelector = 'c3-next-continuation .spinner.nextcontinuation-spinner';
const videoLinkSelector = 'ytm-compact-video-renderer .compact-media-item-metadata-content';


const getBrowser = async () => {
  return await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: false
  });
}

const loadMorePages = async (page, maxPage) => {
  const maxAllowedPage = maxPage > 99 ? 99 : maxPage;

  for (let currentPage = 1; currentPage < maxAllowedPage; currentPage++) {
    console.log('Getting page', currentPage + 1);
    const showMoreElem = await page.$(showMoreButtonSelector);
    if (showMoreElem) {
      await showMoreElem.click();
      // await page.waitForSelector(spinnerSelector, {visible: false});
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      break; //break the loop
    }
  }

  // require('fs').writeFileSync('./list.html', await page.content());

  return page;
}


const getURLContents = async (url, maxPage = 1) => {
  const browser = await getBrowser();

  console.log('user agent', await browser.userAgent());
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

  console.log('Getting page', 1);
  await page.goto(url);

  await loadMorePages(page, maxPage == 'all' ? 99 : maxPage);

  const html = await page.content();
  await browser.close();
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

const getChannelVideos = async (channelId, maxPage) => {
  const url = `https://m.youtube.com/channel/${channelId}/videos`
  const videos = parseVideos(await getURLContents(url, maxPage));
  console.log('video list', videos, `Total ${videos.length} videos`);

  return videos;
}

const getUserVideos = async (userId, maxPage) => {
  const url = `https://m.youtube.com/c/${userId}/videos`;
  const videos = parseVideos(await getURLContents(url, maxPage));

  console.log('video list', videos, `Total ${videos.length} videos`);

  return videos;
}

const getVideoDetails = (videos = []) => {
  return videos.map(async (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`
    const videoDetail =  await youtube.searchOne(url)
    console.log('video detail:', videoDetail)
  });
}

if (require.main === module) {
  // getChannelVideos('UCCMC_4hcI9zoOvjSfka0-xQ', 5);
  // getUserVideos('ValleyRanchIslamicCenter', 5);
  // getVideoDetails(['qSP_BP-pM4w', 'ra-5KkKrbXg', '-7DHxq4PBoQ', 'zZgcOpJOAWo'])
}

module.exports = {
  getChannelVideos,
  getUserVideos,
  getVideoDetails
}
