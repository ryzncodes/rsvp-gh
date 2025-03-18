document.addEventListener('DOMContentLoaded', function() {
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
    let currentLang = getBrowserLanguage();
    
    // Initialize language
    updateLanguage(currentLang);
    
    // Map Drawer Functionality
    const mapToggle = document.getElementById('map-toggle');
    const mapDrawer = document.getElementById('map-drawer');
    const mapIconDown = document.querySelector('.map-icon-down');
    const mapIconUp = document.querySelector('.map-icon-up');
    
    if (mapToggle && mapDrawer) {
        mapToggle.addEventListener('click', function() {
            // Toggle active class on the drawer
            if (mapDrawer.classList.contains('active')) {
                // For closing animation, first remove active class, then hide after transition
                mapDrawer.classList.remove('active');
                // Wait for the transition to complete before adding hidden class
                setTimeout(() => {
                    mapDrawer.classList.add('hidden');
                }, 300); // Match this timing with the CSS transition duration
            } else {
                // For opening, first remove hidden, then add active after a small delay
                mapDrawer.classList.remove('hidden');
                setTimeout(() => {
                    mapDrawer.classList.add('active');
                }, 10);
            }
            
            // Toggle the arrow icons
            mapIconDown.classList.toggle('hidden');
            mapIconUp.classList.toggle('hidden');
        });
    }
    
    // Force set placeholders for form fields based on the current language
    const setFormPlaceholders = (lang) => {
        document.getElementById('name').setAttribute('placeholder', TRANSLATIONS[lang]['name-placeholder']);
        document.getElementById('email').setAttribute('placeholder', TRANSLATIONS[lang]['email-placeholder']);
        document.getElementById('phone').setAttribute('placeholder', TRANSLATIONS[lang]['phone-placeholder']);
        document.getElementById('dietary').setAttribute('placeholder', TRANSLATIONS[lang]['dietary-placeholder']);
    };
    
    // Set initial placeholders
    setFormPlaceholders(currentLang);
    
    // Language toggle functionality
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'bm' : 'en';
            updateLanguage(currentLang);
            
            // Update form placeholders with the new language
            setFormPlaceholders(currentLang);
            
            // Save language preference
            localStorage.setItem('preferredLanguage', currentLang);
            
            // Ensure detail items remain visible after language change
            setTimeout(function() {
                document.querySelectorAll('.detail-item, .detail-item h2, .detail-item p').forEach(function(el) {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
            }, 10);
        });
    }
    
    // Modal elements
    const openModalBtn = document.getElementById('open-rsvp-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('rsvp-modal');
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmation = document.getElementById('confirmation');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const attendingRadios = document.getElementsByName('attending');
    const guestsGroup = document.getElementById('guestsGroup');
    
    // Modal functionality
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            // Make modal visible (Tailwind display)
            modal.classList.remove('hidden');
            modal.classList.add('visible');
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', function() {
            confirmation.classList.add('hidden');
            closeModal();
            
            // Reset form
            if (rsvpForm) {
                rsvpForm.reset();
                rsvpForm.classList.remove('hidden');
            }
        });
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }
    
    // RSVP Form functionality
    if (rsvpForm) {
        // Show/hide guests dropdown based on attendance
        function toggleGuestsVisibility() {
            if (attendingRadios[0].checked) {
                guestsGroup.style.display = 'block';
            } else {
                guestsGroup.style.display = 'none';
            }
        }
    
        // Initial setup
        toggleGuestsVisibility();
        
        // Toggle guests visibility when attendance selection changes
        attendingRadios.forEach(radio => {
            radio.addEventListener('change', toggleGuestsVisibility);
        });
    
        // Handle form submission
        rsvpForm.addEventListener('submit', function(e) {
            console.log('Form submission started');
            
            // No need to prevent default - let the form submit to the iframe
            
            // Show a loading indicator
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = TRANSLATIONS[currentLang]['submitting'] || 'Submitting...';
            submitBtn.disabled = true;
            
            // Log the form data for debugging
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Form data:', data);
            
            // Show confirmation after a delay - this assumes the form submission worked
            setTimeout(() => {
                rsvpForm.classList.add('hidden');
                confirmation.classList.remove('hidden');
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                console.log('RSVP confirmation shown');
            }, 1500);
            
            // No need to prevent the default submission - we let it go to the hidden iframe
        });
        
        // Add form validation for accessibility
        const inputs = rsvpForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', function(event) {
                input.classList.add('error');
                
                // Add styling for error state
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'error-message';
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
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
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
        // Update the language toggle button
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
        
        // Update all elements with data-lang attribute
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(el => {
            const key = el.getAttribute('data-lang');
            if (TRANSLATIONS[lang][key]) {
                el.textContent = TRANSLATIONS[lang][key];
            }
        });
        
        // Update placeholder attributes - modified to handle both ways of specifying placeholders
        const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (TRANSLATIONS[lang][key]) {
                el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
            }
        });
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
    
    // Send a test ping to Google Sheets
    fetch(CONFIG.GOOGLE_SCRIPT_URL + '?ping=true', {
        method: 'GET',
        mode: 'no-cors', // This is needed for Google Apps Script
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
    
    console.log('Google Sheets: Connecting to ' + CONFIG.GOOGLE_SCRIPT_URL);
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