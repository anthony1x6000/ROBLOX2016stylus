// ==UserScript==
// @name         Hello, User!
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.2
// @description  Brings back the thing where roblox welcomed you.
// @author       anthony1x6000
// @license      MIT License: https://github.com/anthony1x6000/ROBLOX2016stylus/blob/main/LICENSE
// @match        https://www.roblox.com/home
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector("#HomeContainer > div.section > div > h1").style = "font-size: 5px; visibility: hidden;";
  const homeID = document.querySelector("#HomeContainer > div.section");
  const newDiv = document.createElement("div");
  let userId = document.getElementsByName('user-data')[0].getAttribute('data-userid');
  let userName = document.getElementsByName('user-data')[0].getAttribute('data-name');
  let userDisplayName = document.getElementsByName('user-data')[0].getAttribute('data-displayName');
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
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
  }
  function finalSet() {
      const profileAV = document.querySelector("#navigation > ul > li:nth-child(1) > a > span > span > img").src;
      const userAVID = document.getElementById("userAV");
      try {
          // throw new Error("testing break");
          userAVID.src = profileAV;
          try {
              new URL(profileAV);
              document.cookie = "uAVCookie=" + profileAV + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
          } catch (err) {
              console.log(`invalid link? Check ${err}`);
          }
      } catch (e) {
          var cookieAV = getCookie("uAVCookie");
          userAVID.src = cookieAV;
          console.log(`Exception found: ${e}. Setting avatar based on cookie. \n Cookie Avatar = ${cookieAV}`);
      }
  }
  window.addEventListener('load', finalSet, false);
  document.addEventListener('visibilitychange', finalSet, false);
})();