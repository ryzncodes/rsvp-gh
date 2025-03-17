# Setting Up Google Sheets Integration

This guide provides detailed instructions on how to connect your RSVP website to Google Sheets for storing responses.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the spreadsheet to something like "Wedding RSVP Responses"
3. Rename the first sheet to "RSVP Responses" (optional but recommended)

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**

   ![Click on Extensions > Apps Script](https://i.imgur.com/8QZZJRv.png)

2. This will open the Google Apps Script editor in a new tab
3. Delete any code that appears in the editor by default
4. Copy the entire code from the `google-apps-script.js` file in this repository
5. Paste it into the Apps Script editor

   ![Paste code into Apps Script editor](https://i.imgur.com/MPZLFVX.png)

6. Click on the disk icon to save the project or press Ctrl+S (Cmd+S on Mac)
7. Give your project a name, such as "Wedding RSVP"

## Step 3: Deploy as a Web App

1. In the Apps Script editor, click on **Deploy** > **New deployment**

   ![Click on Deploy > New deployment](https://i.imgur.com/tJNfhKG.png)

2. Click the gear icon next to "Select type" and choose **Web app**

   ![Select Web app type](https://i.imgur.com/DNJ9Bmp.png)

3. Fill in the deployment information:
   - Description: "Wedding RSVP Form" (or any description you prefer)
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone**

   ![Fill in deployment details](https://i.imgur.com/XiLNokQ.png)

4. Click **Deploy**
5. Google will show a warning about permissions - click **Authorize access**
6. Sign in with your Google account if prompted
7. Review permissions and click **Allow**
8. After deployment, you will see a URL for your web app - **copy this URL**

   ![Copy the web app URL](https://i.imgur.com/y5xqJQ6.png)

## Step 4: Update Your Website

1. Open the `script.js` file in a text editor
2. Find the line with `const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL';`
3. Replace `'YOUR_GOOGLE_SCRIPT_URL'` with the URL you copied from the previous step
4. Save the file

```javascript
// Example of updated code
function submitToGoogleSheets(formData) {
    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
    
    // Rest of the function...
}
```

## Step 5: Test the Integration

1. Open your RSVP website
2. Fill out the form with test information
3. Submit the form
4. Check your Google Sheet - a new row should appear with your test submission
5. The Google Sheet should have columns for all form fields plus a timestamp

If your test submission doesn't appear in the Google Sheet:
- Check the browser console for errors (press F12 to open Developer Tools)
- Verify the script URL is correctly copied into your JavaScript file
- Make sure the web app is deployed with the correct permissions

## Step 6: Redeploy When You Make Changes

If you make changes to the Google Apps Script code:

1. Save your changes
2. Click **Deploy** > **Manage deployments**
3. Select your existing deployment
4. Click the edit icon (pencil)
5. Choose a new version or "New version"
6. Click **Deploy**

The web app URL typically remains the same after redeployment.

## Common Issues and Solutions

### Permission Denied Error

If you see "Permission denied" errors:
1. Make sure the web app is deployed with "Who has access" set to "Anyone"
2. Try redeploying the web app
3. Check that you're signed in to the correct Google account

### CORS Errors

If you see Cross-Origin Resource Sharing (CORS) errors in the console:
1. Make sure you're using `mode: 'no-cors'` in your fetch request
2. Consider using a CORS proxy service

### Data Not Appearing in Spreadsheet

If form submissions aren't appearing in your spreadsheet:
1. Check that the sheet name in the Apps Script matches your actual sheet name
2. Verify that the parameter names in the script match the form field names
3. Try running the `testDoGet` function from the Apps Script editor to test

## Adding Extra Form Fields

If you add more fields to your HTML form:

1. Update the Apps Script code to include the new fields
2. Modify the header array to include the new field names
3. Add the new fields to the data array
4. Redeploy the web app

## Security Considerations

This integration uses a publicly accessible web app URL. Anyone who has this URL could potentially submit data to your spreadsheet. While this is generally fine for an RSVP form, be aware of this limitation.

For additional security, you could:
1. Add a simple verification code that must be included with submissions
2. Implement time-based validation to reject submissions outside your RSVP period
3. Use Google Forms instead of a custom form (simpler but less customizable) 