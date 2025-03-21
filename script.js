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
            // Toggle between hidden and expanded class
            mapDrawer.classList.toggle('expanded');
            
            // Toggle the visibility of the map icons
            mapIconDown.classList.toggle('hidden');
            mapIconUp.classList.toggle('hidden');
            
            // Update button text based on state
            const viewMapText = translations[currentLanguage]['view-map'] || 'View Map';
            const hideMapText = translations[currentLanguage]['hide-map'] || 'Hide Map';
            
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
        document.getElementById('name').setAttribute('placeholder', translations[lang]['name-placeholder']);
        document.getElementById('email').setAttribute('placeholder', translations[lang]['email-placeholder']);
        document.getElementById('phone').setAttribute('placeholder', translations[lang]['phone-placeholder']);
        document.getElementById('dietary').setAttribute('placeholder', translations[lang]['dietary-placeholder']);
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
    const confirmationModal = document.getElementById('confirmation-modal');
    const loadingModal = document.getElementById('loading-modal');
    const confirmation = document.getElementById('confirmation');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const attendanceRadios = document.getElementsByName('attendance');
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
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('visible');
            document.body.style.overflow = '';
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
                alert(translations[currentLanguage]['invalid-phone'] || 'Please enter a valid phone number');
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
                alert(translations[currentLanguage]['submission-error'] || 'Error submitting form. Please try again.');
                
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
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update placeholders for inputs and textareas
        document.querySelectorAll('[data-placeholder]').forEach(element => {
            const key = element.getAttribute('data-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update radio button values based on language
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        if (attendanceRadios.length === 2) {
            attendanceRadios[0].value = translations[lang]['yes'];
            attendanceRadios[1].value = translations[lang]['no'];
        }

        currentLang = lang;
        document.getElementById('current-lang').textContent = lang.toUpperCase();
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
            if (translations[currentLang] && translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        
        // Update all placeholder attributes
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            if (translations[currentLang] && translations[currentLang][key]) {
                el.setAttribute('placeholder', translations[currentLang][key]);
            }
        });
        
        // Update all other data-lang-attr attributes
        document.querySelectorAll('[data-lang-attr]').forEach(el => {
            const attrName = el.getAttribute('data-lang-attr');
            const attrKey = el.getAttribute('data-lang-' + attrName);
            if (translations[currentLang] && translations[currentLang][attrKey]) {
                el.setAttribute(attrName, translations[currentLang][attrKey]);
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