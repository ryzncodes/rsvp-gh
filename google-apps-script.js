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
    // Get the active spreadsheet and the target sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "RSVP Responses"; // Correct sheet name
    var sheet = spreadsheet.getSheetByName(sheetName);
    
    // Check if the sheet exists, throw error if not
    if (!sheet) {
      // Check if headers exist in row 1, if not, set them up
      if (sheet.getLastRow() === 0) {
        var headers = ["Name", "Phone", "Email", "Attendance Status", "Attendees", "Dietary Restrictions", "Wishes", "Timestamp", "Request ID"]; // Renamed 'Attending' header
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setBackground("#4a86e8").setFontColor("white").setFontWeight("bold");
        sheet.setFrozenRows(1);
      }
      // If sheet exists but is empty, still set headers if needed (optional, depends on desired behavior)
    }
    
    // Log incoming parameters for debugging
    Logger.log("Received parameters:", e.parameter);
    
    // Validate required fields (using attendance_status now)
    if (!e.parameter.name || !e.parameter.phone || !e.parameter.attendance_status) {
      throw new Error("Missing required fields (name, phone, or attendance_status)");
    }

    // Clean and validate phone number (remove spaces, dashes, etc)
    var phone = e.parameter.phone.replace(/[^0-9+]/g, '');
    if (phone.length < 10 || phone.length > 15) {
      throw new Error("Invalid phone number format");
    }
    
    // Generate a unique request ID to track duplicates
    var requestId = Utilities.getUuid();
    
    // Check for exact duplicate submissions within the last 10 seconds (prevents double form submission)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Ensure we check the correct number of columns (9 including Request ID)
      var lastEntries = sheet.getRange(2, 1, lastRow - 1, 9).getValues(); 
      var now = new Date();
      var tenSecondsAgo = new Date(now.getTime() - (10 * 1000)); // 10 seconds ago
      
      for (var i = 0; i < lastEntries.length; i++) {
        // Skip empty rows or rows with fewer columns than expected
        if (!lastEntries[i] || !lastEntries[i][0] || lastEntries[i].length < 8) continue; 
        
        // Check if this is a very recent duplicate (same phone within last 10 seconds)
        // Assuming phone is column 2 (index 1) and timestamp is column 8 (index 7)
        if (lastEntries[i][1] === phone && 
            new Date(lastEntries[i][7]) > tenSecondsAgo) {
          Logger.log("Prevented duplicate submission within 10 seconds for phone: " + phone);
          
          // Return success anyway to prevent error messages to user
          var response = {
            "status": "success",
            "message": "RSVP submitted successfully (duplicate prevented)"
          };
          output.setContent(JSON.stringify(response));
          return output;
        }
      }
    }
    
    // Clean and prepare data
    var name = e.parameter.name.trim();
    var email = (e.parameter.email || "").trim();
    var attendance_status = e.parameter.attendance_status; // Use the consistent status
    // Determine attendees based on the consistent status
    var attendees = attendance_status === 'yes' ? (e.parameter.attendees || "1") : "0"; 
    var dietary = (e.parameter.dietary || "").trim();
    var wishes = (e.parameter.wishes || "").trim();
    var timestamp = new Date().toLocaleString("en-MY", {timeZone: "Asia/Kuala_Lumpur"});
    
    // Create the new row data (using attendance_status)
    var rowData = [name, phone, email, attendance_status, attendees, dietary, wishes, timestamp, requestId]; 
    
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
    Logger.log("Error in doGet: " + error.toString() + " Stack: " + error.stack);
    var response = {
      "status": "error",
      "message": "Script error: " + error.toString()
    };
    output.setContent(JSON.stringify(response));
    return output;
  }
}

// Function to set up the sheet with correct headers
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'RSVP Responses';
  var sheet = ss.getSheetByName(sheetName);
  
  // If sheet exists, clear it instead of deleting
  if (sheet) {
    sheet.clearContents(); // Clear only contents, keep formatting/frozen rows if desired
    Logger.log("Cleared contents of sheet: " + sheetName);
  } else {
    // Create a new sheet if it doesn't exist
    sheet = ss.insertSheet(sheetName);
    Logger.log("Created new sheet: " + sheetName);
  }
  
  // Set up headers and format them
  var headers = [
    'Name',
    'Phone', // Swapped Email and Phone to match doGet order
    'Email',
    'Attendance Status', // Updated header
    'Attendees', 
    'Dietary Restrictions',
    'Wishes',
    'Timestamp',
    'Request ID' // Added Request ID header
  ];
  
  // Set headers
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format headers
  headerRange.setBackground('#4a86e8'); // Using the blue from doGet
  headerRange.setFontColor("white");
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log("Sheet setup complete for: " + sheetName);
  return sheet;
}

// Optional: Add a function to test the script
function testDoGet() {
  // Create a mock event object
  var mockEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0123456789', // Cleaned phone
      attendance_status: 'yes', // Use attendance_status
      attendees: '2', 
      dietary: 'No nuts please',
      wishes: 'Congratulations and best wishes!'
    }
  };
  
  // Call the doGet function with the mock event
  Logger.log("Running testDoGet with mock event:", mockEvent);
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
    Logger.log("Test data cleared from RSVP Responses sheet");
  } else if (sheet) {
     Logger.log("No test data to clear in RSVP Responses sheet.");
  } else {
     Logger.log("Sheet 'RSVP Responses' not found.");
  }
}

// Function to reset everything and test
function resetAndTest() {
  // Set up fresh sheet
  Logger.log("Starting resetAndTest...");
  setupSheet();
  
  // Run test
  testDoGet();
  
  Logger.log("Sheet reset and test completed");
}
