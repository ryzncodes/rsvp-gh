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
  // Create text output with CORS headers
  var output = ContentService.createTextOutput();
  
  // Debug: Log all incoming parameters
  Logger.log("Received request with parameters: " + JSON.stringify(e.parameter));
  
  // Handle ping requests for connection testing
  if (e.parameter.ping) {
    output.setMimeType(ContentService.MimeType.TEXT);
    return output.setContent('Connected');
  }
  
  try {
    // Get parameters from the URL
    var params = e.parameter;
    
    // Debug log params received
    Logger.log("Processing parameters: " + JSON.stringify(params));
    
    // Check if we received key data
    if (!params.name || !params.phone) {
      Logger.log("Error: Missing required parameters");
      output.setMimeType(ContentService.MimeType.TEXT);
      return output.setContent('Error: Missing required parameters');
    }
    
    // Get the active spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      Logger.log("Error: Could not access spreadsheet");
      output.setMimeType(ContentService.MimeType.TEXT);
      return output.setContent('Error: Could not access spreadsheet');
    }
    
    // Get or create the sheet
    var sheet = setupSheet();
    
    // Format the data for insertion
    var rowData = [
      params.name || '',
      params.email || '',
      params.phone || '',
      params.attending || '',
      params.guests || '1',
      params.dietary || '',
      params.wishes || '',
      new Date().toLocaleString('en-MY')
    ];
    
    Logger.log("Adding row: " + JSON.stringify(rowData));
    
    // Get the last row and append new data
    var lastRow = Math.max(sheet.getLastRow(), 1);
    var newRange = sheet.getRange(lastRow + 1, 1, 1, rowData.length);
    newRange.setValues([rowData]);
    
    // Auto-resize columns after adding new data
    sheet.autoResizeColumns(1, rowData.length);
    
    // Return success response
    output.setMimeType(ContentService.MimeType.TEXT);
    return output.setContent('Success: RSVP recorded');
    
  } catch (error) {
    // Log the detailed error
    Logger.log("Error in doGet: " + error.toString());
    Logger.log("Stack trace: " + error.stack);
    
    // Return error response
    output.setMimeType(ContentService.MimeType.TEXT);
    return output.setContent('Error: ' + error.message);
  }
}

// Function to set up the sheet with correct headers
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RSVP Responses');
  
  // If sheet exists, clear it instead of deleting
  if (sheet) {
    sheet.clear();
  } else {
    // Create a new sheet if it doesn't exist
    sheet = ss.insertSheet('RSVP Responses');
  }
  
  // Set up headers and format them
  var headers = [
    'Name',
    'Email',
    'Phone',
    'Attending',
    'Number of Guests',
    'Dietary Restrictions',
    'Wishes',
    'Timestamp'
  ];
  
  // Set headers
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format headers
  headerRange.setBackground('#f3f4f6');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  return sheet;
}

// Optional: Add a function to test the script
function testDoGet() {
  // First, reset the sheet
  setupSheet();
  
  // Create a mock event object
  var mockEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      attending: 'Ya',
      guests: '2',
      dietary: 'No nuts please',
      wishes: 'Congratulations and best wishes!'
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

// Function to reset everything and test
function resetAndTest() {
  // Set up fresh sheet
  setupSheet();
  
  // Run test
  testDoGet();
  
  Logger.log("Sheet reset and test completed");
} 