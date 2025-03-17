# Common Errors and Solutions

This document lists common errors you might encounter when setting up or using the wedding RSVP website, and provides solutions for each.

## Google Sheets Integration Errors

### 1. CORS Policy Error

**Error Message:**
```
Access to fetch at 'https://script.google.com/...' from origin 'http://localhost:...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Solution:**
- This is expected behavior when using `mode: 'no-cors'` in the fetch request
- The form data is usually still being submitted despite this error
- Check your Google Sheet to see if the data was received
- If testing locally, you can use a CORS proxy or browser extension that disables CORS for testing

### 2. Google Script URL Not Working

**Error Message:**
```
Failed to fetch
```

**Solution:**
- Verify you've correctly copied the entire URL from the Google Apps Script deployment
- Make sure the URL starts with `https://script.google.com/macros/s/`
- Check that you've deployed the script as a web app with "Anyone" access
- Try redeploying the script and using the new URL

### 3. Permission Denied

**Error Message:**
```
Google Script Error: Exception: You do not have permission to access the requested document.
```

**Solution:**
- Make sure you're logged into the correct Google account that owns the spreadsheet
- Verify the Apps Script project has the necessary permissions:
  - In the Apps Script editor, go to Project Settings
  - Under "Google Cloud Platform (GCP) Project", click on the project number
  - In the new tab, go to "APIs & Services" > "OAuth consent screen"
  - Add yourself as a test user if you haven't already
- Redeploy the web app

## JavaScript Errors

### 1. Form Element Not Found

**Error Message:**
```
Uncaught TypeError: Cannot read property 'addEventListener' of null
```

**Solution:**
- Check that all the element IDs in your JavaScript match the IDs in your HTML
- Ensure your JavaScript runs after the DOM has loaded (we use `DOMContentLoaded` event for this)
- Verify there are no typos in element IDs

### 2. FormData Not Working

**Error Message:**
```
Uncaught TypeError: formData.forEach is not a function
```

**Solution:**
- Make sure you're creating the FormData object correctly: `const formData = new FormData(rsvpForm);`
- Check that your browser supports the FormData API (all modern browsers do)
- If you're manually creating a FormData object, ensure you're using it correctly

## HTML/CSS Errors

### 1. Form Not Styling Correctly

**Issue:**
The form elements don't have the expected styling, such as proper spacing or font sizes.

**Solution:**
- Check that the `styles.css` file is properly linked in your HTML
- Verify that the CSS class names in your stylesheet match those used in the HTML
- Use browser developer tools (F12) to inspect elements and see which styles are being applied
- Clear your browser cache to ensure you're seeing the latest CSS changes

### 2. Form Validation Not Working

**Issue:**
The form submits even when required fields are empty.

**Solution:**
- Ensure that required fields have the `required` attribute
- Check that the form is not being submitted programmatically before validation
- Verify that JavaScript validation code is running correctly
- Test in a different browser to rule out browser-specific issues

## Mobile Responsiveness Issues

### 1. Content Overflowing on Mobile

**Issue:**
Some content extends beyond the screen on mobile devices.

**Solution:**
- Add or adjust the viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Check that your CSS includes proper responsive design techniques
- Use media queries to adjust styling for different screen sizes
- Test on various devices or using browser developer tools' device emulation

### 2. Touch Targets Too Small

**Issue:**
Buttons or form elements are too small to tap easily on mobile devices.

**Solution:**
- Increase the size of interactive elements (buttons, links, form controls)
- Ensure there's adequate spacing between touch targets
- Make sure form inputs have sufficient padding
- Add the following to your CSS:
  ```css
  input, select, textarea, button {
      min-height: 44px; /* Recommended minimum touch target size */
  }
  ```

## Accessibility Issues

### 1. Screen Reader Compatibility

**Issue:**
Screen readers don't properly announce form fields or their purposes.

**Solution:**
- Ensure all form inputs have associated `<label>` elements
- Add appropriate ARIA attributes where needed
- Use semantic HTML elements (`<header>`, `<section>`, `<footer>`, etc.)
- Test with a screen reader to verify everything is announced correctly

### 2. Keyboard Navigation Issues

**Issue:**
Users can't navigate the form using only the keyboard.

**Solution:**
- Ensure all interactive elements can receive focus
- Check that the tab order follows a logical sequence
- Make sure focus states are visible (outline or highlight when an element is focused)
- Test by navigating the entire form using only the Tab key

## Deployment Issues

### 1. Files Not Found After Deployment

**Issue:**
After uploading to a web server, some files are not being found (404 errors).

**Solution:**
- Check that all file paths are correct (case sensitive on some servers)
- Verify all files were uploaded successfully
- Check the server logs for any errors
- Ensure your file structure on the server matches the local structure

### 2. Website Works Locally But Not When Deployed

**Issue:**
The website functions correctly on your local machine but not on the web server.

**Solution:**
- Check for hard-coded local paths that need to be changed
- Verify the server supports all the technologies you're using
- Look for console errors in the browser developer tools
- Test with different browsers to identify browser-specific issues 