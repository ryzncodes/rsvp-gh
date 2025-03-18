document.addEventListener('DOMContentLoaded', function() {
    // Environment variables are loaded from config.js
    // CONFIG should be defined in config.js which is loaded before this script
    
    // Modal elements
    const openModalBtn = document.getElementById('open-rsvp-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('rsvp-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmation = document.getElementById('confirmation');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    
    // Modal functionality
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            modal.classList.remove('hidden');
            modal.classList.add('show');
            modalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
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
            modal.classList.remove('show');
        }
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // RSVP Form functionality
    if (rsvpForm) {
        const guestsGroup = document.getElementById('guestsGroup');
        const attendingYes = document.getElementById('attending-yes');
        const attendingNo = document.getElementById('attending-no');
    
        // Show/hide guests dropdown based on attendance
        function toggleGuestsVisibility() {
            if (attendingYes && attendingYes.checked) {
                guestsGroup.style.display = 'block';
            } else {
                guestsGroup.style.display = 'none';
            }
        }
    
        // Initial setup
        toggleGuestsVisibility();
        
        // Toggle guests visibility when attendance selection changes
        if (attendingYes) {
            attendingYes.addEventListener('change', toggleGuestsVisibility);
        }
        if (attendingNo) {
            attendingNo.addEventListener('change', toggleGuestsVisibility);
        }
    
        // Handle form submission
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show a loading indicator
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Send form data to Google Sheets
            submitToGoogleSheets(formDataObj, function() {
                // Hide form and show confirmation
                rsvpForm.classList.add('hidden');
                confirmation.classList.remove('hidden');
                
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
        
        // Function to submit form data to Google Sheets
        function submitToGoogleSheets(formData, callback) {
            // Google Apps Script Web App URL from config
            const scriptURL = CONFIG.GOOGLE_SCRIPT_URL || 'YOUR_GOOGLE_SCRIPT_URL';
            
            // Convert form data to URL parameters
            const formDataParams = new URLSearchParams(formData).toString();
            
            // Send data to Google Sheets
            fetch(scriptURL + '?' + formDataParams, {
                method: 'GET',
                mode: 'no-cors',
            })
            .then(response => {
                console.log('Success!', response);
                if (callback) callback();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('There was an error submitting your RSVP. Please try again or contact us directly.');
                
                const submitBtn = rsvpForm.querySelector('.submit-btn');
                submitBtn.textContent = 'Submit RSVP';
                submitBtn.disabled = false;
            });
        }
        
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
        // Add fade-in animation to elements
        const elements = homeContainer.querySelectorAll('h1, .tagline, .date, .location, h2, p, .detail-item, .rsvp-button');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Stagger the animations
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Keyboard accessibility for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}); 