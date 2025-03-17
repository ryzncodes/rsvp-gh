document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the RSVP page by looking for the rsvpForm element
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        const confirmation = document.getElementById('confirmation');
        const guestsGroup = document.getElementById('guestsGroup');
        const attendingYes = document.getElementById('attending-yes');
        const attendingNo = document.getElementById('attending-no');
        const newRsvpButton = document.getElementById('newRsvp');
    
        // Show/hide guests dropdown based on attendance
        function toggleGuestsVisibility() {
            if (attendingYes.checked) {
                guestsGroup.style.display = 'block';
            } else {
                guestsGroup.style.display = 'none';
            }
        }
    
        // Initial setup
        toggleGuestsVisibility();
        
        // Toggle guests visibility when attendance selection changes
        attendingYes.addEventListener('change', toggleGuestsVisibility);
        attendingNo.addEventListener('change', toggleGuestsVisibility);
    
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
                
                // Scroll to confirmation
                confirmation.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Reset form and show new RSVP form
        if (newRsvpButton) {
            newRsvpButton.addEventListener('click', function() {
                rsvpForm.reset();
                confirmation.classList.add('hidden');
                rsvpForm.classList.remove('hidden');
                toggleGuestsVisibility();
                
                // Scroll back to top of form
                rsvpForm.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Function to submit form data to Google Sheets
        function submitToGoogleSheets(formData, callback) {
            // Google Apps Script Web App URL - we'll create this in the next step
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzwUrium00Orojj-0IcIAwPfDAbXeheZnQHyoFHUtI_xOWCUIdODE0mRx6-oTnq8PdY/exec';
            
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
    
    // Add animations for the home page if we're on it
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
}); 