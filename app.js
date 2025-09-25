// This is where I store all my regex patterns
const patterns = {
  // This finds email addresses like john@gmail.com
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  
  // This finds websites that start with http:// or https://
  urls: /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/gi,
  
  // This finds phone numbers in different formats like (123) 456-7890
  phones: /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|\b[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  
  // This finds hashtags like #coding or #javascript
  hashtags: /#[\w]+/g,
  
  // This finds money amounts like $19.99 or USD 50
  currency: /(?:USD|EUR|GBP|RWF|\$|€|£)\s?\d+(?:[.,]\d{2})?/g,
  
  // This finds credit card numbers; mostly long numbers with 13-19 digits
  creditCards: /\b(?:\d[ -]*?){13,19}\b/g
};

// This function helps my where each matched data sample will be displayed. like in a color box
function getRisk(type) {
  switch (type) {
    case "emails":
    case "creditCards":
      return "high-risk";     
    case "phones":
    case "currency":
      return "medium-risk";   
    case "urls":
    case "hashtags":
      return "low-risk"; 
    default:
      return "";         
  }
}

// This function checks if a phone number captured is actually valid
function validatePhone(raw) {
  // First, I remove all the extra stuff like spaces, dashes, dots while keeping the + sign because that means international number
  let cleaned = raw.replace(/[^\d+]/g, '');
  
  // If it starts with +1, that's USA country code, so I remove it
  if (cleaned.startsWith('+1')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('+')) {
    // If it has other + codes, I just remove the +
    cleaned = cleaned.slice(1);
  }
  
  // A good phone number should have 10 digits (like 5551234567). Sometimes 11 is okay too
  
  if (cleaned.length === 10 || cleaned.length === 11) {
    return true;  
  }
  
  return false;  
}

// This is the main function that takes text and finds all the different types of data in it.
function extractData(text) {
  // This will store all my results
  const results = {};  
  
  // STEP 1: Find credit cards first. I need to do this first because sometimes credit card numbers, look like phone numbers, and that messes things up
  const creditCardMatches = text.match(patterns.creditCards) || [];
  // this will hold the credit card numbers
  const creditCardPositions = [];  
  
  // For each credit card I found, I need to remember where it is in the text
  creditCardMatches.forEach(match => {
    let index = text.indexOf(match);  
    
    // Sometimes the same credit card appears multiple times
    while (index !== -1) {
      creditCardPositions.push({
        start: index,           // Where the credit card starts
        end: index + match.length  // Where the credit card ends
      });
      
      // Look for this same credit card again after this position
      index = text.indexOf(match, index + 1);
    }
  });
  
  // STEP 2: This is where i will now find all the other procesed number for final validation
  for (const key in patterns) {
    // Use the regex pattern to find matches
    let matches = text.match(patterns[key]) || [];
    
    // Special handling for phone numbers
    if (key === "phones") {
      // I need to filter out phone numbers that are actually parts of credit cards
      matches = matches.filter(match => {
        // Find where this phone number is in the original text
        const matchIndex = text.indexOf(match);
        
        // Check if this phone number overlaps with any credit card
        const overlapsWithCreditCard = creditCardPositions.some(ccPos => {
          const matchEnd = matchIndex + match.length;
          
          // If the phone number is inside a credit card area, skip it
          // This checks for different ways they might overlap
          return (matchIndex >= ccPos.start && matchIndex < ccPos.end) ||
                 (matchEnd > ccPos.start && matchEnd <= ccPos.end) ||
                 (matchIndex <= ccPos.start && matchEnd >= ccPos.end);
        });
        
        // Only keep this phone number if:
        // 1. It doesn't overlap with a credit card AND
        // 2. It passes my phone validation test
        return !overlapsWithCreditCard && validatePhone(match);
      });
    }
    
    // Store the results for this type of data
    results[key] = matches;
  }
  
  return results;  
}

// This function shows the results on the webpage
function displayResults(results) {
  // Get the div where I want to show results
  const container = document.getElementById("results");
  container.innerHTML = "";  // Clear out any old results first
  
  // Check if I found anything at all
  const hasAny = Object.values(results).some(arr => arr.length > 0);
  
  // If I didn't find anything, tell the user
  if (!hasAny) {
    container.innerHTML =
      '<div class="no-issues"><h3 style="color:black;">There were No matches found</h3><p style="color:black;"> Please try different text.</p></div>';
    return; 
  }
  
  // Count up all the things I found
  const total = Object.values(results).reduce((a, arr) => a + arr.length, 0);
  
  // Show the total count at the top
  container.innerHTML =
    `<div class="summary" style="font-weight: bold;">The Total matches found: <strong>${total}</strong></div>`;
  
  // Now show each type of data I found
  for (const type in results) {
    // Only show it if I actually found some
    if (results[type].length > 0) {
      // Get the right color based on how risky this data type is
      const riskClass = getRisk(type);
      
      // Turn the array of matches into HTML list items
      const items = results[type]
      // Wrap each match in <li> tags
        .map(m => `<li>${m}</li>`) 
        // Join them all together 
        .join("");  
      
      // Add this section to the results
      container.innerHTML += `
        <div class="result-box ${riskClass}">
          <h4>${type.toUpperCase()}</h4>
          <ul>${items}</ul>
        </div>`;
    }
  }
}

// This runs when the user clicks the "Check" button
document.getElementById("checkBtn").addEventListener("click", () => {
  // Get the text the user typed in
  const text = document.getElementById("inputText").value;
  
  // Make sure they actually typed something
  if (!text.trim()) {
    document.getElementById("results").innerHTML =
      '<div class="no-text" style="color:black;">Kindly enter some text first.</div>';
    return;  // Stop here if no text
  }
  
  // Do the actual work! by Finding all the data
  const results = extractData(text);  
  // Show it to the user
  displayResults(results);            
});  