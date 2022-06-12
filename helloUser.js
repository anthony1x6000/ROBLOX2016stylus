// ==UserScript==
// @name         Hello, User!
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.1
// @description  Brings back the thing where roblox welcomed you.
// @author       anthony1x6000
// @license      MIT License: https://github.com/anthony1x6000/ROBLOX2016stylus/blob/main/LICENSE
// @match        https://www.roblox.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("#HomeContainer > div.section > div > h1").style = "font-size: 5px; visibility: hidden;"; // "Home" text
  const homeID = document.querySelector("#HomeContainer > div.section");
  const newDiv = document.createElement("div");
  let userId = document.getElementsByName('user-data')[0].getAttribute('data-userid');
  let userName = document.getElementsByName('user-data')[0].getAttribute('data-name');
  let userDisplayName = document.getElementsByName('user-data')[0].getAttribute('data-displayName');
  newDiv.setAttribute("id", "newdiv");
  const NA = "https://raw.githubusercontent.com/anthony1x6000/ROBLOX2016stylus/main/images/error.svg";
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
    <img class="" src="${NA}" alt="Loading..." title="Loading...">
  </span>
</span>
<div id="displayName" class="font-header-2 dynamic-ellipsis-item" style="${displayNameClass}">Hello, ${userDisplayName}!</div>
</a>`;

  window.addEventListener('load', function() { // WAIT FOR PAGE LOAD. listening to dprk music rn
      const profileLink = `https://www.roblox.com/users/${userId}/profile`;
      const profileAV = document.querySelector("#navigation > ul > li:nth-child(1) > a > span > span > img").src;
      const avT = document.querySelector("#navigation > ul > li:nth-child(1)").innerHTML;
      console.log("TEST LOG!!!", profileAV);
      newDiv.innerHTML = `
  <a class="dynamic-overflow-container text-nav" href="https://www.roblox.com/users/${userId}/profile" role="link">
<span id="profileAV" class="avatar avatar-headshot-xs" style="${profileAVClass}">
  <span class="thumbnail-2d-container avatar-card-image">
    <img class="" src="${profileAV}" alt="${userName}" title="${userName}">
  </span>
</span>
<div id="displayName" class="font-header-2 dynamic-ellipsis-item" style="${displayNameClass}">Hello, ${userDisplayName}!</div>
</a>
  `;
}, false);
})();