document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
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
        
        // Get form data
        const formData = new FormData(rsvpForm);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Send form data to Google Sheets
        submitToGoogleSheets(formDataObj);
    });
    
    // Reset form and show new RSVP form
    newRsvpButton.addEventListener('click', function() {
        rsvpForm.reset();
        confirmation.classList.add('hidden');
        rsvpForm.classList.remove('hidden');
        toggleGuestsVisibility();
    });
    
    // Function to submit form data to Google Sheets
    function submitToGoogleSheets(formData) {
        // Show loading state or indicator here if needed
        
        // Google Apps Script Web App URL - we'll create this in the next step
        const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL';
        
        // Convert form data to URL parameters
        const formDataParams = new URLSearchParams(formData).toString();
        
        // Send data to Google Sheets
        fetch(scriptURL + '?' + formDataParams, {
            method: 'GET',
            mode: 'no-cors',
        })
        .then(response => {
            console.log('Success!', response);
            // Hide form and show confirmation
            rsvpForm.classList.add('hidden');
            confirmation.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('There was an error submitting your RSVP. Please try again or contact us directly.');
        });
    }
    
    // Add form validation for accessibility
    const inputs = rsvpForm.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function(event) {
            input.classList.add('error');
        });
        
        input.addEventListener('input', function(event) {
            if (input.validity.valid) {
                input.classList.remove('error');
            }
        });
    });
}); 