// Configuration values
// This file should be processed during build to replace placeholders with actual values
// from environment variables or other secure sources

const CONFIG = {
    // Replace this placeholder during build process
    GOOGLE_SCRIPT_URL: '{{GOOGLE_SCRIPT_URL}}',
};

// For local development, you can override with actual values
// This should never contain actual production values in the repository
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_FOR_TESTING';
}
