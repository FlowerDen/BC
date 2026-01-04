// ---------------- Custom Ribbon: Show/Hide Text Field -----------------
(function () {

    // Add CSS to hide the field
    const style = document.createElement('style');
    style.textContent = '.custom-ribbon-hidden { display: none !important; }';
    document.head.appendChild(style);

    let attemptCount = 0;
    const maxAttempts = 50;

    function initCustomRibbon() {
        attemptCount++;

        // Find the Custom Ribbon checkbox by searching all checkboxes
        const checkbox = [...document.querySelectorAll('input[type="checkbox"]')]
            .find(cb => {
                const container = cb.closest('[data-product-attribute]') || cb.parentElement;
                return container && container.innerText.toLowerCase().includes("custom ribbon");
            });

        if (!checkbox) {
            if (attemptCount >= maxAttempts) {
                console.log("Custom Ribbon checkbox not found after " + maxAttempts + " attempts. Stopping observer.");
                return true; // Stop observer
            }
            return false;
        }

        // Find the Custom Ribbon Text field
        const ribbonTextField = [...document.querySelectorAll('[data-product-attribute]')]
            .find(f => f.innerText.toLowerCase().includes("custom ribbon text"));

        if (!ribbonTextField) return false;

        const ribbonTextInput = ribbonTextField.querySelector("input");
        if (!ribbonTextInput) return false;

        function update() {
            const enabled = checkbox.checked;

            ribbonTextField.classList.toggle("custom-ribbon-hidden", !enabled);
            ribbonTextInput.required = enabled;

            if (!enabled) {
                ribbonTextInput.value = "";
            }
        }

        // Initial state
        update();

        // Watch for checkbox state changes using MutationObserver (works with Modern-Checkbox.js)
        const observer = new MutationObserver(update);
        observer.observe(checkbox, { attributes: true, attributeFilter: ['checked'] });

        // Also listen to click events as fallback
        checkbox.addEventListener("click", update);

        console.log("Custom Ribbon initialized successfully");
        return true;
    }

    // Observe DOM until product options exist
    const observer = new MutationObserver(() => {
        if (initCustomRibbon()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();