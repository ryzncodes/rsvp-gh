// Configuration values
// This file is configured for deployment to GitHub Pages

const CONFIG = {
    // Production Google Script URL - VERIFY THIS IS CORRECT
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxXxigYw-UygMaxRhqDPcj_Y5yDiAvnQ-xdPuY_6-n6P50ctcmDA4-9C-gZShstT7hQ/exec',
    // Debug mode (will show connection status on screen)
    DEBUG: true,
    // Max retries for connection
    MAX_RETRIES: 3,
    // Version for cache busting
    VERSION: '1.0.1'
};

// For local development, enable debug mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEBUG = true;
    
    // Uncomment and replace with your test URL if you have one
    // CONFIG.GOOGLE_SCRIPT_URL = 'YOUR_TESTING_GOOGLE_SCRIPT_URL';
}

// Add these lines to enable console logging of important info about the form
console.log('Using Google Script URL:', CONFIG.GOOGLE_SCRIPT_URL);
console.log('Debug mode:', CONFIG.DEBUG);

// Function to validate the Google Script URL
function validateGoogleScriptURL(url) {
    if (!url) return false;
    
    // Check for valid Google Script URL format
    return url.startsWith('https://script.google.com/macros/s/');
}

// Validate the URL on load
if (!validateGoogleScriptURL(CONFIG.GOOGLE_SCRIPT_URL)) {
    console.error('WARNING: The Google Script URL does not appear to be valid!');
    console.error('Current URL:', CONFIG.GOOGLE_SCRIPT_URL);
    console.error('Please update config.js with a valid Google Script URL');
}
