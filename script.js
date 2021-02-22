// import 結尾沒標示檔案類型無法運作，但 ESLint 要我拿掉檔名，好奇怪＠＠
// eslint-disable-next-line import/extensions
import template from './template.js';

const APIURL = 'https://api.twitch.tv/kraken';
const CLIENT_ID = 'agcz06tlg03ulhxzaggv6bp2by5d5d';

const category = document.querySelector('.category-area');

let currentPlayVideo;

// 頁面載入自動播放影片

function autoPlay() {
  const main = document.querySelector('.main .iframe-inject').getAttribute('id');
  currentPlayVideo = template.carouselPlay(main);
}

function errorHandler(errorMessage) {
  console.log(
    `%c😱 很抱歉我們出錯了！\n${errorMessage}`,
    'background:#9146ff; color:white; font-size:1rem; padding:0 10px',
  );
}

/* ---------------------------------- */
/*                遊戲類別              */
/* ---------------------------------- */

function getGamesData() {
  if (this.status >= 200 && this.status < 400) {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (err) {
      errorHandler(err);
      return;
    }
    data.top.forEach((d) => {
      template.category(d.game.box.large, d.game.localized_name, d.viewers, d.game.name);
    });
  } else {
    errorHandler(this.status);
  }
}

function requestTopGames() {
  const request = new XMLHttpRequest();
  request.open('GET', `${APIURL}/games/top?limit=5`);
  request.setRequestHeader('Client-ID', CLIENT_ID);
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = getGamesData;
  request.onerror = errorHandler;
  request.send();
}

/* ---------------------------------- */
/*               側邊欄推薦             */
/* ---------------------------------- */

function getLiveChannels() {
  if (this.status >= 200 && this.status < 400) {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (err) {
      errorHandler(err);
      return;
    }
    data.streams.forEach((d) => {
      template.recommendChannel(
        d.channel.logo,
        d.channel.display_name,
        d.channel.name,
        d.channel.game,
        d.viewers,
      );
    });
  } else {
    errorHandler(this.status);
  }
}

function requestChannels() {
  const request = new XMLHttpRequest();
  request.open('GET', `${APIURL}/streams?language=zh&limit=10`);
  request.setRequestHeader('Client-ID', CLIENT_ID);
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = getLiveChannels;
  request.onerror = errorHandler;
  request.send();
}

/* ---------------------------------- */
/*           可能喜歡的 LIVE            */
/* ---------------------------------- */

function getMayLikeLive() {
  if (this.status >= 200 && this.status < 400) {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (err) {
      errorHandler(err);
      return;
    }
    data.streams.forEach((d) => {
      template.liveVideo(
        d.preview.large,
        d.channel.description,
        d.channel.logo,
        d.channel.display_name,
        d.channel.name,
        d.channel.game,
        d.viewers,
        true,
        false,
      );
    });
  } else {
    errorHandler(this.status);
  }
}

function requestMayLikeLive() {
  const request = new XMLHttpRequest();
  request.open('GET', `${APIURL}/streams?stream_type=live&limit=2`);
  request.setRequestHeader('Client-ID', CLIENT_ID);
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = getMayLikeLive;
  request.send();
}

/* ---------------------------------- */
/*          Carousel 播放影片           */
/* ---------------------------------- */

function getClips() {
  if (this.status >= 200 && this.status < 400) {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (err) {
      errorHandler(err);
      return;
    }
    data.featured.forEach((d, index) => {
      template.carouselTemplate(
        index,
        d.stream.channel.name,
        d.stream.channel.display_name,
        d.stream.preview.large,
        d.stream.channel.logo,
        d.stream.game,
        d.stream.channel.language,
        d.stream.channel.description,
        d.stream.viewers,
      );
    });
    autoPlay();
  } else {
    errorHandler(this.status);
  }
}

function requestClips() {
  const request = new XMLHttpRequest();
  request.open('GET', `${APIURL}/streams/featured?limit=5`);
  request.setRequestHeader('Client-ID', CLIENT_ID);
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = getClips;
  request.onerror = errorHandler;
  request.send();
}

/* ---------------------------------- */
/*             20 個相關影片            */
/* ---------------------------------- */

function getTwentyVideos() {
  if (this.status >= 200 && this.status < 400) {
    let data;
    try {
      data = JSON.parse(this.response);
    } catch (err) {
      errorHandler(err);
      return;
    }
    const twentyArea = document.querySelector('.twenty-area');
    twentyArea.innerHTML = '';
    data.streams.forEach((d) => {
      template.liveVideo(
        d.preview.large,
        d.channel.description,
        d.channel.logo,
        d.channel.display_name,
        d.channel.name,
        d.channel.game,
        d.viewers,
        { mayLike: false },
        { twenty: true },
      );
    });
  } else {
    errorHandler(this.status);
  }
}

function requestTwentyStreams(gameName) {
  const request = new XMLHttpRequest();
  request.open('GET', `${APIURL}/streams/?game=${gameName}&limit=20`);
  request.setRequestHeader('Client-ID', CLIENT_ID);
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = getTwentyVideos;
  request.onerror = errorHandler;
  request.send();
}

category.addEventListener('click', (e) => {
  const categoryName = e.target.dataset.game;
  requestTwentyStreams(categoryName);
});

requestClips();
requestChannels();
requestTopGames();
requestMayLikeLive();

/* ---------------------------------- */
/*                 輪播                */
/* ---------------------------------- */

const carouselPosition = [
  'left-last-card',
  'left-first-card',
  'main',
  'right-first-card',
  'right-last-card',
];

const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

const carouselCard = document.querySelectorAll('.carousel-card');

function playCarousel() {
  const channelId = document.querySelector('.main .iframe-inject').getAttribute('id');
  currentPlayVideo = template.carouselPlay(channelId);
}

function stopCarousel(left, right) {
  if (left) {
    const leftChannelId = document.querySelector('.left-first-card .iframe-inject');
    leftChannelId.innerHTML = '';
  }

  if (right) {
    const rightChannelId = document.querySelector('.right-first-card .iframe-inject');
    rightChannelId.innerHTML = '';
  }
}

leftArrow.addEventListener('click', () => {
  carouselCard.forEach((el) => {
    const position = el.classList[1];
    el.classList.remove(...el.classList);
    switch (position) {
      case 'left-last-card':
        el.classList.add('carousel-card', `${carouselPosition[4]}`);
        break;
      case 'left-first-card':
        el.classList.add('carousel-card', `${carouselPosition[0]}`);
        break;
      case 'main':
        el.classList.add('carousel-card', `${carouselPosition[1]}`);
        stopCarousel(true, false);
        break;
      case 'right-first-card':
        el.classList.add('carousel-card', `${carouselPosition[2]}`);
        playCarousel();
        break;
      case 'right-last-card':
        el.classList.add('carousel-card', `${carouselPosition[3]}`);
        break;
      default:
        break;
    }
  });
});

rightArrow.addEventListener('click', () => {
  carouselCard.forEach((el) => {
    const position = el.classList[1];
    el.classList.remove(...el.classList);
    switch (position) {
      case 'left-last-card':
        el.classList.add('carousel-card', `${carouselPosition[1]}`);
        break;
      case 'left-first-card':
        el.classList.add('carousel-card', `${carouselPosition[2]}`);
        playCarousel();
        break;
      case 'main':
        el.classList.add('carousel-card', `${carouselPosition[3]}`);
        stopCarousel(false, true);
        break;
      case 'right-first-card':
        el.classList.add('carousel-card', `${carouselPosition[4]}`);
        break;
      case 'right-last-card':
        el.classList.add('carousel-card', `${carouselPosition[0]}`);
        break;
      default:
        break;
    }
  });
});

/* ---------------------------------- */
/*               視訊控制               */
/* ---------------------------------- */

document.addEventListener('click', (e) => {
  if (e.target.closest('.play-btn')) {
    if (currentPlayVideo.isPaused()) {
      const playBtn = document.querySelector('.main .play-btn');
      currentPlayVideo.play();
      playBtn.childNodes[1].setAttribute('src', './src/play_btn.svg');
    } else {
      const playBtn = document.querySelector('.main .play-btn');
      currentPlayVideo.pause();
      playBtn.childNodes[1].setAttribute('src', './src/pause.svg');
    }
  } else if (e.target.closest('.full')) {
    const video = document.querySelector('.main .iframe-inject');
    video.webkitRequestFullscreen();
  }
});
