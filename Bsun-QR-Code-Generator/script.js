/*
 * Bsun QR Code Generator
 * Developer: Bisan Subba
 * Copyright (c) 2026 Bisan Subba.
 * All rights reserved.
 */

"use strict";

// HTML elements
const qrType = document.getElementById("qrType");
const inputFields = document.getElementById("inputFields");
const qrSize = document.getElementById("qrSize");
const foreground = document.getElementById("foreground");
const background = document.getElementById("background");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrContainer = document.getElementById("qrcode");

// Display the appropriate input field
function updateInputField() {
    let label = "";
    let placeholder = "";
    let inputType = "text";

    switch (qrType.value) {
        case "url":
            label = "Website URL";
            placeholder = "https://example.com";
            inputType = "url";
            break;

        case "text":
            label = "Plain Text";
            placeholder = "Enter your text";
            break;

        case "email":
            label = "Email Address";
            placeholder = "example@email.com";
            inputType = "email";
            break;

        case "phone":
            label = "Phone Number";
            placeholder = "+441234567890";
            inputType = "tel";
            break;
    }

    inputFields.replaceChildren();

    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", "qrInput");
    labelElement.textContent = label;

    const inputElement = document.createElement("input");
    inputElement.id = "qrInput";
    inputElement.type = inputType;
    inputElement.placeholder = placeholder;

    inputFields.append(labelElement, inputElement);
}

// Generate QR code
function generateQRCode() {
    const input = document.getElementById("qrInput");
    const value = input.value.trim();

    if (!value) {
        alert("Please enter information to generate a QR code.");
        input.focus();
        return;
    }

    let qrText = value;

    if (qrType.value === "email") {
        qrText = "mailto:" + value;
    } else if (qrType.value === "phone") {
        qrText = "tel:" + value;
    }

    qrContainer.replaceChildren();
    downloadBtn.disabled = true;

    try {
        new QRCode(qrContainer, {
            text: qrText,
            width: Number(qrSize.value),
            height: Number(qrSize.value),
            colorDark: foreground.value,
            colorLight: background.value,
            correctLevel: QRCode.CorrectLevel.H
        });

        downloadBtn.disabled = false;
    } catch (error) {
        console.error("QR generation failed:", error);
        alert("Unable to generate this QR code. Try shorter text.");
    }
}

// Download QR code as PNG
function downloadQRCode() {
    const canvas = qrContainer.querySelector("canvas");
    const image = qrContainer.querySelector("img");

    let imageData = "";

    if (canvas) {
        imageData = canvas.toDataURL("image/png");
    } else if (image && image.src.startsWith("data:image/png")) {
        imageData = image.src;
    }

    if (!imageData) {
        alert("QR code image is not ready yet.");
        return;
    }

    const link = document.createElement("a");
    link.href = imageData;
    link.download = "Bsun-QRCode.png";
    link.click();
}

// Clear all fields and generated QR code
function clearAll() {
    qrType.value = "url";
    qrSize.value = "300";
    foreground.value = "#000000";
    background.value = "#ffffff";

    updateInputField();
    qrContainer.replaceChildren();
    downloadBtn.disabled = true;
}

// Event listeners
qrType.addEventListener("change", () => {
    updateInputField();
    qrContainer.replaceChildren();
    downloadBtn.disabled = true;
});

generateBtn.addEventListener("click", generateQRCode);
clearBtn.addEventListener("click", clearAll);
downloadBtn.addEventListener("click", downloadQRCode);

// Initialise
updateInputField();