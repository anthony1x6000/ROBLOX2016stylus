// ==UserScript==
// @name         Word change
// @namespace    https://github.com/anthony1x6000/ROBLOX2016stylus
// @version      0.1
// @description  try to take over the world!
// @author       anthony1x6000
// @match        https://www.roblox.com/*
// @icon         http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function replaceWord(word, repl) {
        const textNodes = document.getElementsByTagName('*');
        for (let i = 0; i < textNodes.length; i++) {
            let node = textNodes[i];
            node.childNodes.forEach(function(childNode) {
                if (childNode.nodeType === Node.TEXT_NODE) {
                    let content = childNode.textContent;
                    content = content.replace(word, repl);
                    childNode.textContent = content;
                    // console.log(`Replaced ${word} with ${repl}`);
                    // console.log(`New = ${content}`);
                }
            });
        }
    }

    function runafter() { //replace your words here (word to replace, replacement)
        console.log('Running replacement');
        replaceWord('Avatar Shop', 'Catalog');
        replaceWord('Creator Marketplace', 'Library');
        replaceWord('Experiences', 'Games');
    }
    window.addEventListener('load', runafter, false);

    const elementIds = ["right-navigation-header"];
    const observer = new MutationObserver(runafter);
    for (const id of elementIds) {
        const element = document.getElementById(id);
        if (element) {
            observer.observe(element, {
                childList: true,
                subtree: true
            });
        }
    }
    // observer.disconnect(); // uncomment if performance is hit
})();