// ==UserScript==
// @name         Favicon and Title
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.1
// @description  Change roblox icon and title
// @author       anthony1x6000
// @match        https://www.roblox.com/*
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    var icon = document.querySelector("link[rel~='icon']");
    icon.href = 'https://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico';

    var title = document.querySelector("head > title").innerHTML;
    title = title.replace('Roblox', 'ROBLOX');
    document.querySelector("head > title").innerHTML = title;
})();
