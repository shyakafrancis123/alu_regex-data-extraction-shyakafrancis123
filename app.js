// ---------- Regex Patterns ----------
const patterns = {
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  urls: /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/gi,
  // African–focused phone: optional + & up to 3-digit country code, optional spaces/dashes
  phones: /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/,

  hashtags: /#[\w]+/g,
  currency: /(?:USD|EUR|GBP|RWF|\$|€|£)\s?\d+(?:[.,]\d{2})?/g,
  creditCards: /\b(?:\d[ -]*?){13,19}\b/g
};

// Risk mapping for box colors 
function getRisk(type) {
  switch (type) {
    case "emails":
    case "creditCards":
      return "high-risk";     // red tint
    case "phones":
    case "currency":
      return "medium-risk";   // orange tint
    case "urls":
    case "hashtags":
      return "low-risk";      // blue tint
    default:
      return "";
  }
}

// ---------- Main extraction ----------
function extractData(text) {
  const results = {};
  for (const key in patterns) {
    const matches = text.match(patterns[key]);
    results[key] = matches || [];
  }
  return results;
}

// ---------- Display results ----------
function displayResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  const hasAny =
    Object.values(results).some(arr => arr.length > 0);

  if (!hasAny) {
    container.innerHTML =
      '<div class="no-issues"><h3 style="color:black;">There were No matches found</h3><p style="color:black;"> Please try different text.</p></div>';
    return;
  }

  // summary
  const total = Object.values(results).reduce((a, arr) => a + arr.length, 0);
  container.innerHTML =
    `<div class="summary" style="font-weight: bold;">The Total matches found: <strong>${total}</strong></div>`;

  for (const type in results) {
    if (results[type].length > 0) {
      const riskClass = getRisk(type);
      const items = results[type]
        .map(m => `<li>${m}</li>`)
        .join("");
      container.innerHTML += `
        <div class="result-box ${riskClass}">
          <h4>${type.toUpperCase()}</h4>
          <ul>${items}</ul>
        </div>`;
    }
  }
}

// ---------- Hook up button ----------
document.getElementById("checkBtn").addEventListener("click", () => {
  const text = document.getElementById("inputText").value;
  if (!text.trim()) {
    document.getElementById("results").innerHTML =
      '<div class="no-text" style="color:black;">Kindly enter some text first.</div>';
    return;
  }
  const results = extractData(text);
  displayResults(results);
});
