// ---------------- Custom Ribbon: Show/Hide Text Field -----------------
(function () {

    // Add CSS to hide the field
    const style = document.createElement('style');
    style.textContent = '.custom-ribbon-hidden { display: none !important; }';
    document.head.appendChild(style);

    function initCustomRibbon() {

        // Find the Custom Ribbon checkbox by searching all checkboxes
        const checkbox = [...document.querySelectorAll('input[type="checkbox"]')]
            .find(cb => {
                const container = cb.closest('[data-product-attribute]') || cb.parentElement;
                return container && container.innerText.toLowerCase().includes("custom ribbon");
            });

        if (!checkbox) return false;

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

        // Single source of truth
        checkbox.addEventListener("change", update);

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
