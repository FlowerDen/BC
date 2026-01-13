// ---------------- Custom Ribbon: Show/Hide Text Field -----------------
(function () {

    // Add CSS to hide the field
    const style = document.createElement('style');
    style.textContent = '.custom-ribbon-hidden { display: none !important; }';
    document.head.appendChild(style);

    let attemptCount = 0;
    const maxAttempts = 50;

    // Define ribbon pairs: [checkbox identifier, text field identifier]
    const ribbonPairs = [
        { checkbox: "custom ribbon", textField: "custom ribbon text" },
        { checkbox: "standing spray custom ribbon", textField: "standing spray ribbon text" },
        { checkbox: "casket spray custom ribbon", textField: "casket spray ribbon text" }
    ];

    function initCustomRibbon() {
        attemptCount++;

        let allInitialized = true;

        // Process each ribbon pair
        ribbonPairs.forEach(pair => {
            // Find the Custom Ribbon checkbox
            const checkbox = [...document.querySelectorAll('input[type="checkbox"]')]
                .find(cb => {
                    const container = cb.closest('[data-product-attribute]') || cb.parentElement;
                    return container && container.innerText.toLowerCase().includes(pair.checkbox);
                });

            if (!checkbox) {
                allInitialized = false;
                return;
            }

            // Find the Text field
            const ribbonTextField = [...document.querySelectorAll('[data-product-attribute]')]
                .find(f => f.innerText.toLowerCase().includes(pair.textField));

            if (!ribbonTextField) {
                allInitialized = false;
                return;
            }

            const ribbonTextInput = ribbonTextField.querySelector("input");
            if (!ribbonTextInput) {
                allInitialized = false;
                return;
            }

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

            // SIMPLE: Just watch the original checkbox state on a timer
            // Since Modern-Checkbox updates checkbox.checked, we can poll it
            // Use 100ms interval for faster response
            setInterval(() => {
                update();
            }, 100);

            console.log(pair.checkbox + " initialized successfully");
        });

        if (allInitialized) {
            console.log("All ribbon pairs initialized successfully");
            return true;
        }

        if (attemptCount >= maxAttempts) {
            console.log("Not all ribbon pairs found after " + maxAttempts + " attempts. Stopping observer.");
            return true; // Stop observer
        }

        return false;
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