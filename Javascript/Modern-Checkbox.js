document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("[data-product-attribute='input-checkbox']").forEach(field => {

        const original = field.querySelector(".fd-original-checkbox");
        const toggle = field.querySelector(".fd-toggle-checkbox");

        if (!original || !toggle) return;

        // Initial state
        toggle.checked = original.checked;

        // Sync UI → original
        toggle.addEventListener("change", () => {
            original.checked = toggle.checked;
            original.dispatchEvent(new Event("change"));
        });

        // Sync original → UI (in case BC triggers changes)
        original.addEventListener("change", () => {
            toggle.checked = original.checked;
        });

    });

});
