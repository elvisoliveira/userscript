// ==UserScript==
// @name                bilibili Danmaku Disabler
// @name:en-US          bilibili Danmaku Disabler
// @name:zh-CN          bilibili 弹幕关闭
// @name:zh-TW          bilibili 彈幕關閉
// @description         Auto disable bilibili HTML5 player danmaku
// @description:en-US   Auto disable bilibili HTML5 player danmaku
// @description:zh-CN   自动关闭哔哩哔哩 HTML5 播放器弹幕
// @description:zh-TW   自動關閉嗶哩嗶哩 HTML5 播放器彈幕
// @namespace           bilibili-danmaku-disabler
// @version             2021.03.02
// @author              Akatsuki Rui
// @license             MIT License
// @grant               GM_info
// @compatible          chrome Since Chrome 49.x
// @compatible          firefox Since Firefox 44.x
// @compatible          opera Since 17.x
// @run-at              document-idle
// @match               *://www.bilibili.com/*video/*
// @match               *://www.bilibili.com/bangumi/play/*
// @match               *://www.bilibili.com/blackboard/*
// @match               *://www.bilibili.com/html/player.html*
// @match               *://player.bilibili.com/*
// ==/UserScript==

"use strict";

const SELECTOR_NATIVE = {
  on: "input:checked[style='pointer-events: initial;']",
  off: "input:not(:checked)[style='pointer-events: initial;']",
};

const SELECTOR_EMBED = {
  on: "div[class~='bilibili-player-video-btn-danmaku'][data-text='打开弹幕']",
  off: "div[class~='bilibili-player-video-btn-danmaku'][data-text='关闭弹幕']",
};

const SELECTOR =
  document.location.hostname === "player.bilibili.com"
    ? SELECTOR_EMBED
    : SELECTOR_NATIVE;

// Disable danmaku
function disableDanmaku(button) {
  button.click();

  setTimeout(() => {
    if (document.querySelector(SELECTOR.off) === null) {
      disableDanmaku();
    }
  }, 500);
}

// PJAX/pushState detector
function detectPJAX() {
  let buttonPrevious = null;
  let buttonCurrent = null;

  setInterval(() => {
    buttonCurrent = document.querySelector(SELECTOR.on);

    if (buttonCurrent && buttonCurrent !== buttonPrevious) {
      buttonPrevious = buttonCurrent;
      disableDanmaku(buttonCurrent);
    }
  }, 500);
}

// Redirect `/s/video/*` to `/video/*`
location.href.includes("/s/video/")
  ? window.location.replace(location.href.replace("/s/video/", "/video/"))
  : detectPJAX();
