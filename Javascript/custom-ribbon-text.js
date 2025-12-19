// ---------------- Custom Ribbon: Show/Hide Text Field -----------------
document.addEventListener("DOMContentLoaded", function () {

    const ribbonField = Array.from(
        document.querySelectorAll('[data-product-attribute="input-checkbox"]')
    ).find(f => f.innerText.toLowerCase().includes("custom ribbon"));

    if (!ribbonField) return;

    const original = ribbonField.querySelector('input.form-checkbox');
    if (!original) return;

    // Theme slider
    const sliderToggle = ribbonField.querySelector('.styled-switch input[type="checkbox"]');

    const ribbonTextField = Array.from(
        document.querySelectorAll('[data-product-attribute="input-text"]')
    ).find(f => f.innerText.toLowerCase().includes("custom ribbon text"));

    if (!ribbonTextField) return;

    const ribbonTextInput = ribbonTextField.querySelector("input");

    function update() {
        if (original.checked) {
            ribbonTextField.style.display = "block";
            ribbonTextInput.required = true;
        } else {
            ribbonTextField.style.display = "none";
            ribbonTextInput.required = false;
            ribbonTextInput.value = "";
        }
    }

    update();

    // Listen to BOTH so nothing breaks
    original.addEventListener("change", update);
    if (sliderToggle) sliderToggle.addEventListener("change", update);
});