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
  // Set CORS headers
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // Get the active spreadsheet and sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("RSVP Responses");
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet("RSVP Responses");
      // Set up headers
      var headers = ["Name", "Phone", "Email", "Attending", "Number of Guests", "Dietary Restrictions", "Wishes", "Timestamp"];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setBackground("#4a86e8").setFontColor("white").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Log incoming parameters for debugging
    Logger.log("Received parameters:", e.parameter);
    
    // Validate required fields
    if (!e.parameter.name || !e.parameter.phone || !e.parameter.attendance) {
      throw new Error("Missing required fields");
    }

    // Clean and validate phone number (remove spaces, dashes, etc)
    var phone = e.parameter.phone.replace(/[^0-9+]/g, '');
    if (phone.length < 10 || phone.length > 15) {
      throw new Error("Invalid phone number format");
    }

    // Check for duplicate submissions in the last hour
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var lastHourData = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
      var now = new Date();
      var oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
      
      for (var i = 0; i < lastHourData.length; i++) {
        if (lastHourData[i][1] === phone && // Check phone number
            new Date(lastHourData[i][7]) > oneHourAgo) { // Check timestamp
          throw new Error("Duplicate submission detected");
        }
      }
    }
    
    // Clean and prepare data
    var name = e.parameter.name.trim();
    var email = (e.parameter.email || "").trim();
    var attending = e.parameter.attendance;
    var guests = attending === "Ya" ? (e.parameter.guests || "1") : "0";
    var dietary = (e.parameter.dietary || "").trim();
    var wishes = (e.parameter.wishes || "").trim();
    var timestamp = new Date().toLocaleString("en-MY", {timeZone: "Asia/Kuala_Lumpur"});
    
    // Create the new row data
    var rowData = [name, phone, email, attending, guests, dietary, wishes, timestamp];
    
    // Append the new row
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, rowData.length).setValues([rowData]);
    
    // Auto-resize columns to fit content
    sheet.autoResizeColumns(1, rowData.length);
    
    // Return success response
    var response = {
      "status": "success",
      "message": "RSVP submitted successfully"
    };
    output.setContent(JSON.stringify(response));
    return output;
    
  } catch(error) {
    // Log the error and return error response
    Logger.log("Error: " + error.toString());
    var response = {
      "status": "error",
      "message": error.toString()
    };
    output.setContent(JSON.stringify(response));
    return output;
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