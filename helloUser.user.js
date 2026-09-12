// ==UserScript==
// @name         Hello, User!
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.4
// @description  Brings back the thing where roblox welcomed you.
// @author       anthony1x6000
// @license      MIT License: https://github.com/anthony1x6000/ROBLOX2016stylus/blob/main/LICENSE
// @match        https://www.roblox.com/home
// @connect      thumbnails.roblox.com
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("#HomeContainer > div.section > div > h1").style = "font-size: 5px; visibility: hidden;";
  const homeID = document.querySelector("#HomeContainer > div.section");
  const newDiv = document.createElement("div");
  const meta = document.querySelector('meta[name="user-data"]');
  let userId = meta?.dataset?.userid ?? meta?.getAttribute('data-userid') ?? document.getElementsByName('user-data')[0]?.getAttribute('data-userid');
  let userName = meta?.dataset?.name ?? meta?.getAttribute('data-name') ?? document.getElementsByName('user-data')[0]?.getAttribute('data-name');
  let userDisplayName = meta?.dataset?.displayname ?? meta?.getAttribute('data-displayName') ?? document.getElementsByName('user-data')[0]?.getAttribute('data-displayName');
  newDiv.setAttribute("id", "newdiv");
  const NA = "https://t3.rbxcdn.com/894dca84231352d56ec346174a3c0cf9";
  const profileAVClass = `
  height: 128px;
  width: 128px;
  margin-right: 15px;
  margin-bottom: 0px;
  `;
  const displayNameClass = `
  font-size: 30px;
  margin-top: calc(128px / 3);
  `;
  homeID.parentNode.insertBefore(newDiv, homeID);
  newDiv.innerHTML = `
  <a class="dynamic-overflow-container text-nav" href="https://www.roblox.com/users/${userId}/profile" role="link">
    <span id="profileAV" class="avatar avatar-headshot-xs" style="${profileAVClass}">
      <span class="thumbnail-2d-container avatar-card-image">
        <img id="userAV" class="" src="${NA}" alt="${userName}" title="${userName}">
      </span>
    </span>
    <div id="displayName" class="font-header-2 dynamic-ellipsis-item" style="${displayNameClass}">Hello, ${userDisplayName}!</div>
  </a>
  `;
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

  async function waitForElement(selector) {
      while (!document.querySelector(selector)) {
          await new Promise(resolve => setTimeout(resolve, 100));
      }
  }

  async function fetchHeadshotUrl(uid) {
      const api = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(uid)}&size=352x352&format=Png&isCircular=false`;
      const res = await fetch(api, { credentials: 'omit' });
      if (!res.ok) throw new Error(`thumbnails API HTTP ${res.status}`);
      const json = await res.json();
      const imageUrl = json?.data?.[0]?.imageUrl;
      if (!imageUrl) throw new Error('thumbnails API returned no imageUrl');
      return imageUrl;
  }

  async function finalSet() {
      const userAVID = document.getElementById("userAV");
      if (!userAVID) return;
      try {
          const headshotUrl = await fetchHeadshotUrl(userId);
          new URL(headshotUrl);
          userAVID.src = headshotUrl;
          document.cookie = `uAVCookie=${encodeURIComponent(headshotUrl)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
      } catch (err) {
          console.log(`Error: ${err}`);
          // Fallback: nav-bar avatar, then stale cookie
          try {
              await waitForElement("#navigation > ul > li:nth-child(1) > a > span > span > img");
              const profileAV = document.querySelector("#navigation > ul > li:nth-child(1) > a > span > span > img").src;
              new URL(profileAV);
              userAVID.src = profileAV;
              document.cookie = `uAVCookie=${encodeURIComponent(profileAV)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
          } catch (fallbackErr) {
              console.log(`Fallback error: ${fallbackErr}`);
              const cookieAV = getCookie("uAVCookie");
              if (cookieAV) userAVID.src = decodeURIComponent(cookieAV);
              console.log(`Setting avatar based on cookie. Cookie Avatar = ${cookieAV}`);
          }
      }
  }

  finalSet();
  window.addEventListener('load', finalSet);
  document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') finalSet();
  });
})();