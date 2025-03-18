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
  // Set CORS headers for all responses
  var output = ContentService.createTextOutput();
  output.setHeader('Access-Control-Allow-Origin', '*');
  
  // Debug: Log all incoming parameters
  Logger.log("Received request with parameters: " + JSON.stringify(e.parameter));
  
  // Handle ping requests for connection testing
  if (e.parameter.ping) {
    return output.setContent('Connected').setMimeType(ContentService.MimeType.TEXT);
  }
  
  try {
    // Get parameters from the URL
    var params = e.parameter;
    
    // Debug log params received
    Logger.log("Processing parameters: " + JSON.stringify(params));
    
    // Check if we received key data
    if (!params.name && !params.email) {
      Logger.log("Error: Missing required parameters");
      return output.setContent('Error: Missing required name or email').setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Get the active spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      Logger.log("Error: Could not access spreadsheet");
      return output.setContent('Error: Could not access spreadsheet').setMimeType(ContentService.MimeType.TEXT);
    }
    
    var sheet = ss.getSheetByName('RSVP Responses');
    if (!sheet) {
      // Create the sheet if it doesn't exist
      Logger.log("Creating new RSVP Responses sheet");
      sheet = ss.insertSheet('RSVP Responses');
    }
    
    // Check if the headers are set
    var headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
    if (headers[0] === '') {
      // Set the headers
      Logger.log("Setting up sheet headers");
      sheet.getRange(1, 1, 1, 7).setValues([
        ['Name', 'Email', 'Phone', 'Attending', 'Number of Guests', 'Dietary Restrictions', 'Timestamp']
      ]);
      sheet.setFrozenRows(1);
    }
    
    // Get the last row with data
    var lastRow = Math.max(sheet.getLastRow(), 1);
    
    // Format the data for insertion
    var rowData = [
      params.name || '',
      params.email || '',
      params.phone || '',
      params.attending || '',
      params.guests || '',
      params.dietary || '',
      new Date().toLocaleString()
    ];
    
    Logger.log("Adding row: " + JSON.stringify(rowData));
    
    // Append the new response
    sheet.getRange(lastRow + 1, 1, 1, 7).setValues([rowData]);
    
    // Return a success response
    return output.setContent('Success: RSVP recorded').setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    // Log the detailed error
    Logger.log("Error in doGet: " + error.toString());
    Logger.log("Stack trace: " + error.stack);
    
    // Return a detailed error message
    return output.setContent('Error: ' + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
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
  var result = doGet(mockEvent);
  
  Logger.log('Test response: ' + result.getContent());
}

// Function to clear test data - run this manually if needed
function clearTestData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RSVP Responses');
  
  if (sheet && sheet.getLastRow() > 1) {
    // Keep the headers (row 1) and clear everything else
    sheet.deleteRows(2, sheet.getLastRow() - 1);
    Logger.log("Test data cleared");
  }
} 