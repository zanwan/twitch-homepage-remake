# Twitch 首頁復刻
串接 Legacy Twitch API v5 重製 Twitch 首頁的切版練習，製作 3D 效果 Carousel 與縮圖增厚凸起效果。

- [Live Demo](https://twitch.zangwang.tw/)
- [Original Repo](https://github.com/Lidemy/mentor-program-4th-cybershota/pull/11)

## Twitch Carousel
使用 CSS position, z-index 與 transition 搭配 JavaScript Array 儲存輪播位置與 Switch case 製作 3D 輪播效果，
XMLHttpRequest 請求 API 提共目前熱門直播，iframe inject 影片內容與相關資料，可暫停播放影片、全螢幕播放。

![](https://github.com/cybershota/imagebed/blob/main/twitch-carosuel-small.gif)

## Twitch Thumbnail Hover Effect
使用 CSS transition 製作 hover 效果，XMLHttpRequest 請求前 20 項該類別熱門直播

![](https://github.com/cybershota/imagebed/blob/main/twitch-fetch-small.gif)

## 製作心得
挑戰複雜切版，學到非常多。原來 Z 軸的 UI 元件就像做動畫時的圖層堆疊，在不同圖層運作，再由一個最高父層統一移動達到整體效果。從 Carousel 的製作中，
了解到兼顧視覺美感與功能的元件也是相當考驗程式邏輯的，我非常喜歡這樣的挑戰與練習。要復刻就要一模一樣是吧！
