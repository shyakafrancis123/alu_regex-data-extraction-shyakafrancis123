# Regular Expression Assignment
This project demonstrates how to use **regular expressions (regex)** in JavaScript to find and display different types of data from a text file.

## Project Structure
project-folder/
│
├─ index.html # Main webpage with the user interface
├─ app.js # JavaScript logic to read the file and apply regex patterns
├─ style.css # Basic styling for the page
└─ sample.txt # Sample text file used for testing regex patterns


## How It Works
1. **index.html**  
   - Provides a simple interface with a button or form to trigger the regex checks.
   - Links to `style.css` for styling and `app.js` for functionality.

2. **app.js**  
   - Loads the content of `sample.txt` using JavaScript 
   - Uses **regular expressions** to search for specific patterns (e.g., email addresses, phone numbers, times, URLs, hasttags and credit card numbers and currencies).
   - Displays the matches on the webpage.

3. **style.css**  
   - Adds basic styling to make the results clear and readable.

4. **sample.txt**  
   - Contains mixed sample data such as:
     ```
     user@example.com
     https://www.example.com
     (123) 456-7890
     1234 5678 9012 3456
     14:30
     2:30 PM
     <p>Hello</p>
     #example
     $19.99
     ```
   - This text is used to test all regex patterns.

## Setup and Usage
1. **Clone the Project**  
   ```bash
   git clone git@github.com:shyakafrancis123/alu_regex-data-extraction-shyakafrancis123.git
   cd project-alu_regex-data-extraction-shyakafrancis123

Explanation of the regex syntax
  // Match email addresses like john@gmail.com
  // \b                ---- word boundary so we don't match inside other text
  // [A-Za-z0-9._%+-]+ ------- username: letters, digits, dots, underscores, %, +, -
  // @                 ------ literal at sign
  // [A-Za-z0-9.-]+    -------  domain name: letters, digits, dots, hyphens
  // \.                ------- literal dot before top-level domain
  // [A-Za-z]{2,}      -------  top-level domain with at least 2 letters (com, org, rw)
  // \b                ------- word boundary to end the match
  // g                 -------- global flag: find all matches
  
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  // Match websites starting with http:// or https://
  // \b               ------- word boundary
  // https?           ------- "http" plus optional "s"
  // ://              ------- literal "://"
  // [^\s/$.?#].      ------- first character of domain (not space or special chars)
  // [^\s]*           ------- rest of the URL until a space
  // \b               ------- word boundary
  // g                -------- global (all matches)
  // i                -------- case-insensitive (allows HTTP as well)
  
   urls: /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/gi,
  // Match US-style phone numbers like (123) 456-7890 or 123-456-7890
  // (?:\+?1[-.\s]?)?  ---------- optional country code +1 with optional separator
  // \(?[0-9]{3}\)?    ---------- 3-digit area code with optional parentheses
  // [-.\s]?           ---------- optional separator (dash, dot, or space)
  // [0-9]{3}          ---------- 3 digits
  // [-.\s]?           ------------ optional separator
  // [0-9]{4}          --------4 digits
  // \b                --------- word boundary
  // |                 -------- OR pattern to match numbers without country code
  // g                 ---------- global search
  
  phones: /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|\b[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  // #      ------ literal hash sign
  // \w+    ------ one or more word chars (letters, digits, underscore)
  // g      ----- global search
  
  hashtags: /#[\w]+/g,

  // Match money amounts like $19.99, USD 50, €12
  // (?:USD|EUR|GBP|RWF|\$|€|£) ------- currency codes or symbols
  // \s?                        -------- optional space
  // \d+                        ------ one or more digits
  // (?:[.,]\d{2})?             ------- optional decimal/comma and two digits
  // g                           ------ global search
  
  currency: /(?:USD|EUR|GBP|RWF|\$|€|£)\s?\d+(?:[.,]\d{2})?/g,
  // Match credit card numbers of 13–19 digits, allowing spaces or hyphens
  // \b                    -------- word boundary
  // (?:\d[ -]*?){13,19}    ------- a digit followed by optional space or dash,
  //                          repeated 13 to 19 times
  // \b                    ------ word boundary
  // g                     ------- global search
  creditCards: /\b(?:\d[ -]*?){13,19}\b/g
};
