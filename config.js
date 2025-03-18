// Configuration values
// This file is configured for deployment to GitHub Pages

const CONFIG = {
    // Production Google Script URL
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzULnmCrfMKLZkDNj80YH1uJq2XKuLTUcKUVMbP/exec',
};

// For local development, you can override with test values
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_FOR_TESTING';
}
