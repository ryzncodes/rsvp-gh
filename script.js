document.addEventListener('DOMContentLoaded', function() {
    // Ensure all elements are visible at load
    document.querySelectorAll('.detail-item, .detail-item h2, .detail-item p').forEach(function(el) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
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
            // Toggle the active class on the drawer
            mapDrawer.classList.toggle('hidden');
            setTimeout(() => {
                mapDrawer.classList.toggle('active');
            }, 10);
            
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
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show a loading indicator
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = TRANSLATIONS[currentLang]['submitting'] || 'Submitting...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send the data to your server
                // For now, we'll just simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show confirmation
                rsvpForm.classList.add('hidden');
                confirmation.classList.remove('hidden');
                
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Optional: Send email notification
                // You would need to implement this on your server
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                alert(TRANSLATIONS[currentLang]['submission-error'] || 'There was an error submitting your RSVP. Please try again.');
                
                submitBtn.textContent = TRANSLATIONS[currentLang]['submit-rsvp'] || 'Submit RSVP';
                submitBtn.disabled = false;
            }
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