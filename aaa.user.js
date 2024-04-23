// ==UserScript==
// @name         javdb手动排除影片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add exclude button to JavDB items and save excluded items state
// @author       You
// @match        https://javdb.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Function to toggle item exclusion
    function toggleExclusion(item, excludeBtn) {
        const title = item.querySelector('.video-title strong');
        const excludedItems = GM_getValue('excludedItems', []);

        if (excludedItems.includes(title.textContent)) {
            // Remove from excluded items
            const index = excludedItems.indexOf(title.textContent);
            excludedItems.splice(index, 1);
            GM_setValue('excludedItems', excludedItems);
            resetBackgroundColor(item.querySelector('.cover').nextElementSibling); // Reset background color after cover
            excludeBtn.textContent = '排除';
        } else {
            // Add to excluded items
            excludedItems.push(title.textContent);
            GM_setValue('excludedItems', excludedItems);
            setBackgroundColor(item.querySelector('.cover').nextElementSibling, 'red'); // Set background color after cover to red
            excludeBtn.textContent = '恢复';
        }
    }

    // Function to set background color for an element and its following siblings
    function setBackgroundColor(element, color) {
        while (element) {
            element.style.backgroundColor = color;
            element = element.nextElementSibling;
        }
    }

    // Function to reset background color for an element and its following siblings
    function resetBackgroundColor(element) {
        while (element) {
            element.style.backgroundColor = '';
            element = element.nextElementSibling;
        }
    }

    // Function to create exclude button
    function createExcludeButton(item) {
        const excludeBtn = document.createElement('button');
        excludeBtn.textContent = '排除';
        excludeBtn.style.marginLeft = '10px';
        excludeBtn.classList.add('exclude_button');
        excludeBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling
            const excludeBtn = event.currentTarget;
            const item = excludeBtn.closest('.item');
            toggleExclusion(item, excludeBtn);
        });
        return excludeBtn;
    }

    // Main function to process items on the page
    function processItems() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const excludeBtn = createExcludeButton(item);
            item.appendChild(excludeBtn);

            const title = item.querySelector('.video-title strong');
            const excludedItems = GM_getValue('excludedItems', []);
            if (excludedItems.includes(title.textContent)) {
                setBackgroundColor(item.querySelector('.cover').nextElementSibling, 'red'); // Set background color after cover to red for excluded items
                excludeBtn.textContent = '恢复';
            }
        });
    }

    // Run main function when the page is loaded
    window.addEventListener('load', function() {
        processItems();
    });
})();
