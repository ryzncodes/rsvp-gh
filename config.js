// Configuration values
// This file is configured for deployment to GitHub Pages

const CONFIG = {
    // Production Google Script URL - VERIFY THIS IS CORRECT
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx88A9RrPy1scyuWTJW1U1DYfJcsfnP_lQrZPnSWDq8X2UWGQUYsn3_4fW1Psw0Hvdm/exec',
    // Debug mode (will show connection status on screen)
    DEBUG: true
};

// For local development, enable debug mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEBUG = true;
    
    // Uncomment and replace with your test URL if you have one
    // CONFIG.GOOGLE_SCRIPT_URL = 'YOUR_TESTING_GOOGLE_SCRIPT_URL';
}

// Add this line to enable console logging of important info about the form
console.log('Using Google Script URL:', CONFIG.GOOGLE_SCRIPT_URL);
