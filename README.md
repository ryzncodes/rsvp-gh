# Simple Wedding RSVP Website

A simple, accessible wedding RSVP website designed with senior citizens in mind. The website includes a landing page with wedding information and an RSVP form that submits responses to a Google Sheet.

## Features

- Simple, clean design with large text and high contrast
- Responsive layout that works on desktop and mobile devices
- Accessible form with proper ARIA attributes
- Form validation to prevent errors
- Google Sheets integration for collecting responses
- Easy to customize for your event

## Setup Instructions

### 1. Configure the Google Sheet

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Go to Extensions > Apps Script
3. Delete any code in the editor and paste the contents of `google-apps-script.js` from this repository
4. Save the project (e.g., name it "Wedding RSVP")
5. Deploy the script as a web app:
   - Click Deploy > New deployment
   - Select type: Web app
   - Set "Execute as" to "Me" (your Google account)
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the Web app URL that is provided

### 2. Update the Website

1. Open `script.js` in a text editor
2. Replace `'YOUR_GOOGLE_SCRIPT_URL'` with the URL you copied from Google Apps Script
3. Save the file

### 3. Customize the Website

1. Open `index.html` and update the wedding details:
   - Names of the couple
   - Date and time
   - Venue name and address
   - Contact email
   - RSVP deadline

2. Modify `styles.css` to change colors or layout if desired

### 4. Hosting the Website

You can host this website on any web hosting service. Some simple options:

- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Any shared web hosting service

Simply upload all the files to your hosting provider according to their instructions.

## Testing

Before sharing your RSVP website with guests:

1. Fill out and submit the form yourself
2. Check your Google Sheet to verify the response was recorded
3. Test on multiple devices (desktop, tablet, phone)
4. Ask someone unfamiliar with the website to test it

## Accessibility Features

This website includes several features to make it accessible to senior citizens:

- Large text (18px base font size, larger for headings and important text)
- High contrast colors for readability
- Simple, straightforward layout
- Clear instructions
- Properly labeled form fields
- Keyboard accessibility
- Form validation with clear error messages

## Files Included

- `index.html` - The main webpage with wedding info and RSVP form
- `styles.css` - Styling with accessibility in mind
- `script.js` - JavaScript to handle form submission
- `google-apps-script.js` - Code to paste into Google Apps Script (not used directly)
- `README.md` - This documentation file

## Customization Tips

- To change colors, edit the CSS variables at the top of `styles.css`
- Add wedding photos by inserting `<img>` tags in the HTML
- Add more form fields by following the same pattern in the HTML form
- Change the confirmation message in the HTML

## Troubleshooting

**Form submissions not appearing in Google Sheet:**
- Verify the Google Script URL is correctly pasted in script.js
- Check that the Google Sheet has a sheet named "RSVP Responses"
- Make sure the web app is deployed with the correct permissions

**Form validation errors:**
- Check console for JavaScript errors
- Verify that all form field IDs match what's referenced in the JavaScript

## License

This project is free to use and modify for personal use. 