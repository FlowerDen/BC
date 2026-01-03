// ---------------- Custom Ribbon: Show/Hide Text Field -----------------
(function () {

    // Add CSS to hide the field
    const style = document.createElement('style');
    style.textContent = '.custom-ribbon-hidden { display: none !important; }';
    document.head.appendChild(style);

    function initCustomRibbon() {
        console.log("Searching for Custom Ribbon checkbox...");

        // Find the Custom Ribbon checkbox by searching all checkboxes
        const checkbox = [...document.querySelectorAll('input[type="checkbox"]')]
            .find(cb => {
                const container = cb.closest('[data-product-attribute]') || cb.parentElement;
                const text = container ? container.innerText.toLowerCase() : '';
                console.log("Checking container text:", text);
                return text.includes("custom ribbon") && !text.includes("text");
            });

        if (!checkbox) {
            console.log("Custom Ribbon checkbox not found");
            return false;
        }
        console.log("✓ Custom Ribbon checkbox found:", checkbox);

        // Find the Custom Ribbon Text field
        const ribbonTextField = [...document.querySelectorAll('[data-product-attribute]')]
            .find(f => {
                const text = f.innerText.toLowerCase();
                return text.includes("custom ribbon text");
            });

        if (!ribbonTextField) {
            console.log("Custom Ribbon Text field not found");
            return false;
        }
        console.log("✓ Custom Ribbon Text field found:", ribbonTextField);

        const ribbonTextInput = ribbonTextField.querySelector("input");
        if (!ribbonTextInput) {
            console.log("Custom Ribbon Text input not found");
            return false;
        }
        console.log("✓ Custom Ribbon Text input found:", ribbonTextInput);

        function update() {
            // Use setTimeout to ensure we get the updated checkbox state
            setTimeout(() => {
                const enabled = checkbox.checked;
                console.log("Update called - checkbox checked:", enabled);

                ribbonTextField.classList.toggle("custom-ribbon-hidden", !enabled);
                ribbonTextInput.required = enabled;

                if (!enabled) {
                    ribbonTextInput.value = "";
                }
                console.log("Field visibility:", enabled ? "visible" : "hidden");
            }, 0);
        }

        // Set initial state based on current checkbox value
        const initialState = checkbox.checked;
        console.log("Initial checkbox state:", initialState);
        
        if (initialState) {
            ribbonTextField.classList.remove("custom-ribbon-hidden");
            ribbonTextInput.required = true;
        } else {
            ribbonTextField.classList.add("custom-ribbon-hidden");
            ribbonTextInput.required = false;
        }
        console.log("Initial state set - field", initialState ? "visible" : "hidden");

        // Listen to both change and click events
        checkbox.addEventListener("change", () => {
            console.log("Checkbox changed event fired");
            update();
        });

        checkbox.addEventListener("click", () => {
            console.log("Checkbox clicked event fired");
            update();
        });

        console.log("Event listeners attached");
        return true;
    }

    // Observe DOM until product options exist
    const observer = new MutationObserver(() => {
        if (initCustomRibbon()) {
            observer.disconnect();
            console.log("✅ Custom Ribbon initialization complete");
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Custom Ribbon observer started");

})();
