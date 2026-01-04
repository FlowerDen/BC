// ==UserScript==
// @name         BC Custom Ribbon Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom Ribbon Text for BC
// @author       FlowerDen
// @match        https://bondageprojects.elementfx.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @match        https://bondage-europe.com/*
// @match        https://www.bondage-europe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bondageprojects.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_ID = "RibbonCustomText";
    const CHECKBOX_ID = "RibbonCustomTextEnabled";
    const RIBBON_TEXT_KEY = "BC_CustomRibbonText";
    const RIBBON_ENABLED_KEY = "BC_CustomRibbonTextEnabled";

    // Create the UI elements
    function createUI() {
        const container = document.createElement("div");
        container.style.cssText = "position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; z-index: 10000; color: white; font-family: Arial, sans-serif;";

        const label = document.createElement("label");
        label.textContent = "Custom Ribbon Text: ";
        label.style.marginRight = "5px";

        const input = document.createElement("input");
        input.type = "text";
        input.id = INPUT_ID;
        input.value = localStorage.getItem(RIBBON_TEXT_KEY) || "";
        input.style.cssText = "margin-right: 10px; padding: 2px;";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = CHECKBOX_ID;
        checkbox.checked = localStorage.getItem(RIBBON_ENABLED_KEY) === "true";

        const checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = " Enable";
        checkboxLabel.style.marginLeft = "5px";

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(checkbox);
        container.appendChild(checkboxLabel);

        document.body.appendChild(container);

        return { input, checkbox };
    }

    // Update the ribbon text
    function update() {
        const input = document.getElementById(INPUT_ID);
        const checkbox = document.getElementById(CHECKBOX_ID);

        if (checkbox && checkbox.checked) {
            const customText = input ? input.value : "";
            localStorage.setItem(RIBBON_TEXT_KEY, customText);
            localStorage.setItem(RIBBON_ENABLED_KEY, "true");
            if (typeof ChatRoomCharacterViewCharacterName === 'function') {
                // Force update the character view if available
                console.log("Custom Ribbon Text enabled:", customText);
            }
        } else {
            localStorage.setItem(RIBBON_ENABLED_KEY, "false");
        }
    }

    // Initialize
    const { input, checkbox } = createUI();

    // Add event listeners
    input.addEventListener("input", () => {
        localStorage.setItem(RIBBON_TEXT_KEY, input.value);
        setTimeout(update, 10);
    });

    checkbox.addEventListener("click", () => {
        setTimeout(update, 10);
    });

    // Initial update
    update();
})();
