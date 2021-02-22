const { Twitch } = window;

const categoryArea = document.querySelector('.category-area');
const recommendArea = document.querySelector('.recommend-area');
const mayLikeArea = document.querySelector('.maylike-area');
const twentyArea = document.querySelector('.twenty-area');

// new Twitch 使用的設定檔
const options = {
  width: '100%',
  height: '100%',
  channel: 'channel name',
  controls: false,
  muted: false,
  parent: ['127.0.0.1', 'cybershota.imfast.io'],
};

// 數字三位一逗點
function numberBeautify(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 側邊欄用名稱顯示美化
function channelNameBeautify(displayname, name) {
  if (displayname.toLowerCase() === name) {
    return displayname;
  }
  const nameBlock = `${displayname} (${name})`;
  return nameBlock;
}

// 主區塊頻道標題與內容美化
function videoTitleBeautify(description, channelName) {
  if (description.length <= 0) {
    return channelName;
  }
  return description;
}

const template = {
  category(img, localizedName, viewers, name) {
    const el = document.createElement('div');
    el.className = 'category-block';
    el.innerHTML = `
    <div class="stream-category" data-game="${name}">
      <div class="img-wrapper">
        <img src="${img}" alt="${name}_img">
      </div>
      <div class="streamer-card">
        <div class="streamer-data">
          <h4>${localizedName}</h4>
          <p>觀眾人數：${numberBeautify(viewers)}</p>
          <button class="language-badge">中文</button>
        </div>
      </div>
    </div>`;
    categoryArea.appendChild(el);
  },
  recommendChannel(img, displayname, name, game, views) {
    const el = document.createElement('div');
    el.className = 'recommend-block';
    el.innerHTML = `
    <div class="avatar">
    <img src="${img}" alt="${displayname}_img" />
    </div>
    <div class="recommend-name">
      <h5>${channelNameBeautify(displayname, name)}</h5>
      <p>${game}</p>
    </div>
    <div class="recommend-view">
      <span>●</span>
      <span>${numberBeautify(views)}</span>
    </div>`;
    recommendArea.appendChild(el);
  },
  liveVideo(previewImg, description, logo, displayName, name, game, viewers, mayLike, twenty) {
    const el = document.createElement('div');
    el.className = 'stream-block';
    el.innerHTML = `
      <div class="video-wrapper">
        <span class="live-badge">LIVE</span>
        <span class="view-count">觀眾人數：${numberBeautify(viewers)}</span>
        <img src="${previewImg}" alt="${displayName}_img"/>
      </div>
      <div class="streamer-card">
        <div class="streamer-column">
        <div class="avatar">
          <img src="${logo}" alt="${displayName}_avatar"/>
        </div>
        <div class="streamer-data">
        <h6>${videoTitleBeautify(description, displayName)}</h6>
        <p>${channelNameBeautify(displayName, name)}</p>
        <p class="streamer-category">${game}</p>
        <button class="language-badge">中文</button>
        </div>
        </div>
      </div>
    `;
    if (mayLike) {
      mayLikeArea.appendChild(el);
    }
    if (twenty) {
      twentyArea.appendChild(el);
    }
  },
  /*
    Twitch Interactive Frames 使用方式：
    CDN Twitch embed script，引入 Twitch 物件
    Twitch 實例會讀取 DOM 元素有 channel/video/collection 的 id，將 iframe 插入該元素中。
    new Twitch.Player('<div id="指定id">', options)
  */
  /*
    這裡先將影片 id 塞入 DOM，生成預覽圖與相關資訊但不先載入影片，待使用者訪問，再監聽觸發一支影片播放，使用者按左右選擇鍵，再監聽觸發 Twitch 塞新影片進 DOM。
  */
  carouselTemplate(
    index,
    channelName,
    displayName,
    previewImg,
    avatar,
    game,
    language,
    description,
    viewers,
  ) {
    const carouselCard = document.querySelectorAll('.carousel-card');
    carouselCard[index].innerHTML = `
    <div class="carousel-view">
      <div class="iframe-inject" id="${channelName}"></div>
      <img src="${previewImg}" alt="${displayName}_live_preview" />
      <span class="live-badge">LIVE</span>
            <!-- 視訊控制 -->
      <div class="up-gradient"></div>
      <div class="video-control">
        <!-- 左側控制 -->
        <div class="left-control">
          <div class="video-btn play-btn">
            <img src="./src/play_btn.svg" alt="play video" />
          </div>
          <div class="video-btn volume">
            <img src="./src/volumn_btn.svg" alt="video volume" />
          </div>
        </div>
        <!-- 右側控制 -->
        <div class="right-control">
          <div class="video-btn gear">
            <img src="./src/gear_btn.svg" alt="video setting" />
          </div>
          <div class="video-btn full">
            <img src="./src/full_screen_btn.svg" alt="full screen" />
          </div>
        </div>
      </div>
    </div>
    <div class="gray-cover"></div>
    <div class="info">
      <div class="name-block">
        <div class="avatar">
          <img
            src="${avatar}"
            alt="${displayName}_avatar"
          />
        </div>
        <div class="broadcaster">
          <ul>
            <li>${displayName}</li>
            <li>${game}</li>
            <li>觀眾人數：${numberBeautify(viewers)}</li>
          </ul>
        </div>
      </div>
      <div class="description">
        <div class="langtag">${language}</div>
        <p>${description}</p>
      </div>
    </div>
    `;
  },
  carouselPlay(channelName) {
    options.channel = channelName;
    const player = new Twitch.Player(channelName, options);
    player.play();
    return player;
  },
};

export default template;
