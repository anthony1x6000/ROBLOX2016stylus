// ==UserScript==
// @name         No Friend Activity
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.1
// @description  Replace "n Friend" / game-tile-stats-friend-activity
// @author       anthony1x6000
// @license      MIT License: https://github.com/anthony1x6000/ROBLOX2016stylus/blob/main/LICENSE
// @match        https://www.roblox.com/home
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let run = true;
    async function getPlayerCount(universeId) {
        const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        let playing = data.data[0].playing;
        if (playing >= 1000) {
            playing = (playing / 1000).toFixed(1) + 'K';
        }
        return playing;
    }

    async function getUpvotePercentage(universeId) {
        const response = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        const upVotes = data.data[0].upVotes;
        const downVotes = data.data[0].downVotes;
        const totalVotes = upVotes + downVotes;
        const upvotePercentage = (upVotes / totalVotes) * 100;
        return Math.round(upvotePercentage) + '%';
    }
    async function getBaseElement(uniID) {
        const upvotePercentage = await getUpvotePercentage(uniID);
        const playerCount = await getPlayerCount(uniID);
        return `
    <span class="info-label icon-votes-gray">
    </span><span class="info-label vote-percentage-label">
    ${upvotePercentage}
    </span><span class="info-label icon-playing-counts-gray"></span>
    <span class="info-label playing-counts-label">
    ${playerCount}
    </span>
    `;
    }

    function findGameCardLinks() {
        const gameCarousels = document.querySelectorAll('.game-carousel');
        const gameCardLinks = [];
        gameCarousels.forEach(carousel => {
            const links = carousel.querySelectorAll('a.game-card-link');
            links.forEach(link => gameCardLinks.push(link));
        });
        return gameCardLinks;
    }

    function scanElements() {
        console.log("scanning elements");
        const gameCardLinks = findGameCardLinks();
        gameCardLinks.forEach(element => {
            run = false;
            let uniID = element.getAttribute("id");
            let childDiv = element.querySelector('div[data-testid="game-tile-stats-friend-activity"]');
            if (childDiv) {
                childDiv.setAttribute('data-testid', 'game-tile-stats');
                getBaseElement(uniID).then(result => {
                    childDiv.innerHTML = result;
                });
            }
        });
    }

    const observeThis = document.querySelectorAll(".game-card-info");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                if (run) {
                    scanElements();
                }
            }
        });
    });
    observeThis.forEach(carousel => observer.observe(carousel, { childList: true }));
    observer.observe(document.body, { childList: true, subtree: true });
})();