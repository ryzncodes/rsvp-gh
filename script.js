// Global error handler to catch any JavaScript errors
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.message);
    console.error('Error source:', event.filename, 'Line:', event.lineno, 'Column:', event.colno);
    console.error('Error object:', event.error);
    
    // Display visible error message in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.bottom = '10px';
        errorDiv.style.left = '10px';
        errorDiv.style.backgroundColor = 'red';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = `Error: ${event.message} (${event.filename}:${event.lineno})`;
        document.body.appendChild(errorDiv);
    }
});

// Global helper to access translations safely
function getTranslation(lang, key, defaultValue = '') {
    try {
        // Try to get from TRANSLATIONS first
        if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            return TRANSLATIONS[lang][key];
        }
        
        // Return default value if no translation found
        return defaultValue;
    } catch (e) {
        console.error(`Error accessing translation [${lang}][${key}]:`, e);
        return defaultValue;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - starting script initialization");
    
    // Debug translation object
    console.log("Translations object found:", typeof TRANSLATIONS !== 'undefined' ? "YES" : "NO");
    
    // Debug button existence
    const rsvpButton = document.getElementById('open-rsvp-modal');
    const langButton = document.getElementById('lang-toggle');
    console.log("RSVP button found:", rsvpButton ? "YES" : "NO");
    console.log("Language toggle button found:", langButton ? "YES" : "NO");
    
    // Add direct onclick attributes to the buttons in case event listeners fail
    if (rsvpButton) {
        rsvpButton.setAttribute('onclick', "openRSVPModal(event); return false;");
    }
    
    if (langButton) {
        langButton.setAttribute('onclick', "toggleLanguage(); return false;");
    }
    
    // Ensure all elements are visible at load
    document.querySelectorAll('.detail-item, .detail-item h2, .detail-item p').forEach(function(el) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Check Google Sheets connection
    checkGoogleSheetsConnection();
    
    // Environment variables are loaded from config.js
    // CONFIG should be defined in config.js which is loaded before this script
    
    // Language Settings
    let currentLanguage = getBrowserLanguage();
    console.log("Current language:", currentLanguage);
    
    // Initialize language
    updateLanguage(currentLanguage);
    
    // Map Drawer Functionality
    const mapToggle = document.getElementById('map-toggle');
    const mapDrawer = document.getElementById('map-drawer');
    const mapIconDown = document.querySelector('.map-icon-down');
    const mapIconUp = document.querySelector('.map-icon-up');
    
    if (mapToggle && mapDrawer) {
        mapToggle.addEventListener('click', function() {
            // Toggle between hidden and expanded class
            mapDrawer.classList.toggle('expanded');
            
            // Toggle the visibility of the map icons
            mapIconDown.classList.toggle('hidden');
            mapIconUp.classList.toggle('hidden');
            
            // Update button text based on state
            const viewMapText = getTranslation(currentLanguage, 'view-map', 'View Map');
            const hideMapText = getTranslation(currentLanguage, 'hide-map', 'Hide Map');
            
            const langSpan = mapToggle.querySelector('[data-lang="view-map"]');
            if (langSpan) {
                if (mapDrawer.classList.contains('expanded')) {
                    langSpan.textContent = hideMapText;
                } else {
                    langSpan.textContent = viewMapText;
                }
            }
        });
        
        // Ensure the overlay text in the map is initially hidden
        const mapOverlayText = document.querySelector('.google-maps-text');
        if (mapOverlayText) {
            mapOverlayText.style.display = 'none';
            mapOverlayText.style.opacity = '0';
            mapOverlayText.style.visibility = 'hidden';
        }
    }
    
    // Force set placeholders for form fields based on the current language
    const setFormPlaceholders = (lang) => {
        try {
            document.getElementById('name').setAttribute('placeholder', getTranslation(lang, 'name-placeholder', 'Enter your name'));
            document.getElementById('email').setAttribute('placeholder', getTranslation(lang, 'email-placeholder', 'Enter your email'));
            document.getElementById('phone').setAttribute('placeholder', getTranslation(lang, 'phone-placeholder', 'Enter your phone'));
            document.getElementById('dietary').setAttribute('placeholder', getTranslation(lang, 'dietary-placeholder', 'Enter dietary restrictions'));
        } catch (e) {
            console.error("Error setting form placeholders:", e);
        }
    };
    
    // Set initial placeholders
    setFormPlaceholders(currentLanguage);
    
    // Language toggle functionality
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        console.log("Adding click event to language toggle button");
        langToggle.addEventListener('click', function() {
            console.log("Language toggle clicked - switching language");
            currentLanguage = currentLanguage === 'en' ? 'bm' : 'en';
            console.log("Language switched to:", currentLanguage);
            updateLanguage(currentLanguage);
            
            // Update form placeholders with the new language
            setFormPlaceholders(currentLanguage);
            
            // Save language preference
            localStorage.setItem('preferredLanguage', currentLanguage);
            
            // Ensure detail items remain visible after language change
            setTimeout(function() {
                document.querySelectorAll('.detail-item, .detail-item h2, .detail-item p').forEach(function(el) {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
            }, 10);
        });
    } else {
        console.error("Language toggle button not found in DOM");
    }
    
    // Modal elements
    const openModalBtn = document.getElementById('open-rsvp-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('rsvp-modal');
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmationModal = document.getElementById('confirmation-modal');
    const loadingModal = document.getElementById('loading-modal');
    const confirmation = document.getElementById('confirmation');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const attendanceRadios = document.getElementsByName('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    
    // Modal functionality
    if (openModalBtn) {
        console.log("Adding click event to RSVP button");
        openModalBtn.addEventListener('click', function(e) {
            console.log("RSVP button clicked - opening modal");
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event propagation
            
            // Make sure the modal element exists
            if (!modal) {
                console.error("Modal element not found");
                return;
            }
            
            // Make modal visible (Tailwind display)
            modal.classList.remove('hidden');
            modal.classList.add('visible');
            
            // Directly add styling to ensure visibility
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
            // Debug modal state
            console.log("Modal classes:", modal.className);
            console.log("Modal display:", window.getComputedStyle(modal).display);
        });
    } else {
        console.error("RSVP button not found in DOM");
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Thank you modal close button
    const closeThankYouBtn = document.querySelector('#thank-you-modal .close-modal');
    if (closeThankYouBtn) {
        closeThankYouBtn.addEventListener('click', function() {
            const thankYouModal = document.getElementById('thank-you-modal');
            if (thankYouModal) {
                thankYouModal.classList.add('hidden');
                thankYouModal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modal when clicking outside content
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close confirmation modal when clicking outside content
    if (confirmationModal) {
        confirmationModal.addEventListener('click', function(e) {
            if (e.target === confirmationModal) {
                closeConfirmationModal();
                
                // Reset form
                if (rsvpForm) {
                    rsvpForm.reset();
                }
            }
        });
    }
    
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', function() {
            closeConfirmationModal();
            
            // Reset form
            if (rsvpForm) {
                rsvpForm.reset();
                rsvpForm.classList.remove('hidden');
            }
        });
    }
    
    function closeModal() {
        console.log("Closing modal");
        
        if (modal) {
            // Use both Tailwind classes and direct styles for maximum compatibility
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            
            // Direct styling to ensure it's hidden
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            
            // Re-enable body scrolling
            document.body.style.overflow = '';
            
            // Debug modal state after closing
            console.log("Modal closed, classes:", modal.className);
        } else {
            console.error("Modal element not found when trying to close");
        }
    }
    
    function openLoadingModal() {
        // Close the RSVP modal first
        closeModal();
        
        // Open loading modal
        if (loadingModal) {
            loadingModal.classList.remove('hidden');
            loadingModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLoadingModal() {
        if (loadingModal) {
            loadingModal.classList.add('hidden');
            loadingModal.classList.remove('visible');
        }
    }
    
    function openConfirmationModal() {
        // Close the loading modal first
        closeLoadingModal();
        
        // Open confirmation modal
        if (confirmationModal) {
            confirmationModal.classList.remove('hidden');
            confirmationModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // RSVP Form functionality
    if (rsvpForm) {
        const attendanceRadios = document.getElementsByName('attendance');
        const guestsGroup = document.getElementById('guestsGroup');

        // Show/hide guests dropdown based on attendance
        function toggleGuestsVisibility() {
            const selectedRadio = document.querySelector('input[name="attendance"]:checked');
            if (selectedRadio && selectedRadio.value === 'Ya') {
                guestsGroup.style.display = 'block';
            } else {
                guestsGroup.style.display = 'none';
            }
        }
    
        // Initial setup
        toggleGuestsVisibility();
        
        // Toggle guests visibility when attendance selection changes
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', toggleGuestsVisibility);
        });
    
        // Handle form submission
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission started');
            
            // Prevent double submissions
            if (this.dataset.submitting === 'true') {
                console.log('Preventing double submission');
                return false;
            }
            
            // Mark form as submitting
            this.dataset.submitting = 'true';
            
            // Show loading modal
            openLoadingModal();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            
            // Clean phone number
            data.phone = data.phone.replace(/[^0-9+]/g, '');
            
            // Validate phone number
            if (data.phone.length < 10 || data.phone.length > 15) {
                closeLoadingModal();
                alert(getTranslation(currentLanguage, 'invalid-phone', 'Please enter a valid phone number'));
                this.dataset.submitting = 'false';
                return;
            }
            
            // Create URL with parameters
            const params = new URLSearchParams();
            for (let [key, value] of Object.entries(data)) {
                params.append(key, value.trim());
            }
            
            // Log the full URL for debugging
            const url = `${CONFIG.GOOGLE_SCRIPT_URL}?${params.toString()}`;
            console.log('Submitting to URL:', url);
            
            // Submit to Google Sheets
            submitToGoogleSheets(url, data, function(response) {
                // Close loading modal
                closeLoadingModal();
                
                // Close RSVP modal if it's still open
                closeModal();
                
                // Open thank you modal
                const thankYouModal = document.getElementById('thank-you-modal');
                if (thankYouModal) {
                    thankYouModal.classList.remove('hidden');
                    thankYouModal.classList.add('visible');
                } else {
                    console.error('Thank you modal element not found');
                }
                
                // Reset form
                rsvpForm.reset();
                console.log('RSVP confirmation shown');
                
                // Reset submitting flag after 3 seconds
                setTimeout(() => {
                    document.getElementById('rsvpForm').dataset.submitting = 'false';
                }, 3000);
            }, function(error) {
                // Close loading modal and show error
                closeLoadingModal();
                alert(getTranslation(currentLanguage, 'submission-error', 'Error submitting form. Please try again.'));
                
                // Reset submitting flag
                document.getElementById('rsvpForm').dataset.submitting = 'false';
            });
        });
        
        // Add form validation for accessibility
        const inputs = rsvpForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', function(event) {
                input.classList.add('error');
                
                // Add styling for error state
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'error-message text-red-500 text-sm mt-1';
                    errorMessage.textContent = input.validationMessage;
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            });
            
            input.addEventListener('input', function(event) {
                if (input.validity.valid) {
                    input.classList.remove('error');
                    
                    // Remove error message if it exists
                    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                        input.nextElementSibling.remove();
                    }
                }
            });
        });
    }
    
    // Add animations for the home page
    const homeContainer = document.querySelector('.home-container');
    if (homeContainer) {
        // Add fade-in animation to elements with a fallback
        const elements = homeContainer.querySelectorAll('h1, .tagline, .date, .location, h2, p, .detail-item, .rsvp-button');
        
        // Set initial opacity to ensure everything is visible even if animation fails
        elements.forEach(el => {
            el.style.opacity = "1";
        });
        
        // Setup the animation with anime.js with error handling
        try {
            const timeline = anime.timeline({
                easing: 'easeOutQuad',
                duration: 800,
                begin: function() {
                    // Make sure elements are visible when animation begins
                    elements.forEach(el => {
                        el.style.opacity = "0";
                    });
                }
            });
            
            timeline.add({
                targets: 'header h1',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: 300
            })
            .add({
                targets: 'header .tagline, header .date, header .location, .full-names',
                opacity: [0, 1],
                translateY: [15, 0],
                delay: anime.stagger(150)
            }, '-=500')
            .add({
                targets: '.detail-item',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(200)
            }, '-=400')
            .add({
                targets: '.rsvp-button, .rsvp-deadline',
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.9, 1]
            }, '-=200');
        } catch (error) {
            console.error("Animation error:", error);
            // If animation fails, make sure all elements are visible
            elements.forEach(el => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });
        }
    }
    
    // Keyboard accessibility for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close RSVP modal if open
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
            
            // Close confirmation modal if open
            if (confirmationModal && !confirmationModal.classList.contains('hidden')) {
                closeConfirmationModal();
                
                // Reset form
                if (rsvpForm) {
                    rsvpForm.reset();
                }
            }
        }
    });
    
    // Language utility functions
    function getBrowserLanguage() {
        // Check if there's a saved preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            return savedLang;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        // If browser language starts with 'ms' (Malay), use 'bm'
        if (browserLang.startsWith('ms')) {
            return 'bm';
        }
        
        // Default to English
        return 'en';
    }
    
    function updateLanguage(lang) {
        console.log("Updating language to:", lang);
        
        // Fallback if language doesn't exist
        if (!(typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang])) {
            console.error("No translations found for language:", lang);
            lang = 'en'; // Default to English
            console.log("Falling back to default language (en)");
        }
        
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            try {
                element.textContent = getTranslation(lang, key, element.textContent);
            } catch (err) {
                console.error(`Error updating element with key ${key}:`, err);
            }
        });

        // Update placeholders for inputs and textareas
        document.querySelectorAll('[data-placeholder]').forEach(element => {
            const key = element.getAttribute('data-placeholder');
            try {
                element.placeholder = getTranslation(lang, key, element.placeholder);
            } catch (err) {
                console.error(`Error updating placeholder with key ${key}:`, err);
            }
        });

        // Update radio button values based on language
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        if (attendanceRadios.length === 2) {
            try {
                attendanceRadios[0].value = getTranslation(lang, 'yes', 'Yes');
                attendanceRadios[1].value = getTranslation(lang, 'no', 'No');
            } catch (err) {
                console.error("Error updating radio buttons:", err);
            }
        }

        currentLanguage = lang;
        
        // Update the language toggle display
        const langDisplay = document.getElementById('current-lang');
        if (langDisplay) {
            langDisplay.textContent = lang.toUpperCase();
        }
    }

    // Language switching function
    function switchLanguage(lang) {
        const currentLang = lang || (localStorage.getItem('wedding-lang') || 'en');
        localStorage.setItem('wedding-lang', currentLang);
        
        // Update language toggle button
        document.getElementById('current-lang').textContent = currentLang.toUpperCase();
        
        // Update all translatable elements
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
                el.innerHTML = TRANSLATIONS[currentLang][key];
            }
        });
        
        // Update all placeholder attributes
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
                el.setAttribute('placeholder', TRANSLATIONS[currentLang][key]);
            }
        });
        
        // Update all other data-lang-attr attributes
        document.querySelectorAll('[data-lang-attr]').forEach(el => {
            const attrName = el.getAttribute('data-lang-attr');
            const attrKey = el.getAttribute('data-lang-' + attrName);
            if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][attrKey]) {
                el.setAttribute(attrName, TRANSLATIONS[currentLang][attrKey]);
            }
        });
    }

    // Add click handler for thank you modal overlay
    const thankYouModal = document.getElementById('thank-you-modal');
    if (thankYouModal) {
        thankYouModal.addEventListener('click', function(e) {
            if (e.target === thankYouModal) {
                thankYouModal.classList.add('hidden');
                thankYouModal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        });
    }
}); 

// Google Sheets connection check
function checkGoogleSheetsConnection() {
    // Only run if CONFIG is defined
    if (typeof CONFIG === 'undefined' || !CONFIG.GOOGLE_SCRIPT_URL) {
        console.error('Google Sheets: Configuration missing. Please check config.js file.');
        updateConnectionStatus('error', 'Google Sheets configuration missing');
        return;
    }
    
    // Check if the URL is the placeholder
    if (CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL' || 
        CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_FOR_TESTING') {
        console.error('Google Sheets: Please replace the placeholder URL with your actual Google Script URL');
        updateConnectionStatus('error', 'Google Sheets URL not configured');
        return;
    }
    
    // Check if we're in development mode
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
        // Show connection status in development mode
        const statusEl = document.getElementById('connection-status');
        if (statusEl) statusEl.classList.remove('hidden');
    }
    
    updateConnectionStatus('checking', 'Checking connection to Google Sheets...');
    
    try {
        // Send a test ping to Google Sheets
        fetch(CONFIG.GOOGLE_SCRIPT_URL + '?ping=true', {
            method: 'GET',
            mode: 'no-cors', // This is needed for Google Apps Script
            cache: 'no-cache'
        })
        .then(() => {
            console.log('Google Sheets: Connection test sent successfully');
            updateConnectionStatus('success', 'Connected to Google Sheets');
            // Note: We can't actually check the response due to CORS restrictions
            // This just confirms we were able to send the request
        })
        .catch(error => {
            console.error('Google Sheets: Connection failed', error);
            updateConnectionStatus('error', 'Connection to Google Sheets failed');
        });
    } catch (e) {
        console.error('Google Sheets: Error sending connection test', e);
        updateConnectionStatus('error', 'Error connecting to Google Sheets');
    }
    
    console.log('Google Sheets: Connecting to ' + CONFIG.GOOGLE_SCRIPT_URL);
}

// Submit to Google Sheets with enhanced error handling
function submitToGoogleSheets(url, data, onSuccess, onError) {
    console.log('Submitting to URL:', url);
    
    try {
        // Submit to Google Sheets
        fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
        })
        .then(response => {
            console.log('Response received');
            if (onSuccess) onSuccess(response);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            if (onError) onError(error);
        });
    } catch (e) {
        console.error('Exception when submitting form:', e);
        if (onError) onError(e);
    }
}

// Helper to update connection status indicator
function updateConnectionStatus(status, message) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    
    // Clear existing status classes
    statusEl.classList.remove('text-green-500', 'text-red-500', 'text-yellow-500');
    
    // Add appropriate status class
    switch(status) {
        case 'success':
            statusEl.classList.add('text-green-500');
            break;
        case 'error':
            statusEl.classList.add('text-red-500');
            break;
        case 'checking':
            statusEl.classList.add('text-yellow-500');
            break;
    }
}

// Global functions for direct onclick attributes
function openRSVPModal(event) {
    console.log("Direct RSVP button click detected");
    event.preventDefault();
    
    const modal = document.getElementById('rsvp-modal');
    if (modal) {
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
    }
}

function toggleLanguage() {
    console.log("Direct language toggle click detected");
    
    // Get current language
    const currentLangElement = document.getElementById('current-lang');
    const currentLang = currentLangElement ? currentLangElement.textContent.toLowerCase() : 'en';
    
    // Toggle language
    const newLang = (currentLang === 'en' || currentLang === 'en') ? 'bm' : 'en';
    
    // Update all elements using the translation function
    if (typeof updateLanguage === 'function') {
        updateLanguage(newLang);
    } else {
        console.error("updateLanguage function not found");
    }
} 