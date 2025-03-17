// This code goes in the Google Apps Script editor
// Steps to set up:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Copy and paste this code
// 4. Save the project with a name like "Wedding RSVP"
// 5. Deploy as a web app (Deploy > New deployment > Web app)
// 6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
// 7. Copy the web app URL and paste it in your script.js file where it says 'YOUR_GOOGLE_SCRIPT_URL'

function doGet(e) {
  // Get parameters from the URL
  var params = e.parameter;
  
  // Get the active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RSVP Responses') || ss.insertSheet('RSVP Responses');
  
  // Check if the headers are set
  var headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
  if (headers[0] === '') {
    // Set the headers
    sheet.getRange(1, 1, 1, 7).setValues([
      ['Name', 'Email', 'Phone', 'Attending', 'Number of Guests', 'Dietary Restrictions', 'Timestamp']
    ]);
    sheet.setFrozenRows(1);
  }
  
  // Get the last row with data
  var lastRow = Math.max(sheet.getLastRow(), 1);
  
  // Append the new response
  sheet.getRange(lastRow + 1, 1, 1, 7).setValues([
    [
      params.name || '',
      params.email || '',
      params.phone || '',
      params.attending || '',
      params.guests || '',
      params.dietary || '',
      new Date().toLocaleString()
    ]
  ]);
  
  // Return a success response
  return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
}

// Optional: Add a function to test the script
function testDoGet() {
  // Create a mock event object
  var mockEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      attending: 'Yes',
      guests: '2',
      dietary: 'No nuts please'
    }
  };
  
  // Call the doGet function with the mock event
  doGet(mockEvent);
  
  Logger.log('Test data added to spreadsheet');
} 