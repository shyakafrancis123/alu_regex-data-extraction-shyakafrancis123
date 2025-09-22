function checkText() {
    const text = document.getElementById('inputText').value;
    
    if (!text) {
        document.getElementById('results').innerHTML = '<p class="no-text">Please enter some text to check.</p>';
        return;
    }

    const patterns = {
        emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        urls: /\bhttps?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?\b/g,
        phones: /\b(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
        creditCards: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
        time: /\b((1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM))\b|\b((2[0-3]|[01]?[0-9]):[0-5][0-9])\b/gi,
        htmlTags: /<\/?[a-zA-Z][^>]*>/g,
        hashtags: /#\w+/g,
        currency: /\$\d{1,3}(,\d{3})*(\.\d{2})?/g
    };

    let foundItems = {};
    let totalFound = 0;

    for (let type in patterns) {
        const matches = text.match(patterns[type]) || [];
        if (matches.length > 0) {
            foundItems[type] = matches;
            totalFound += matches.length;
        }
    }

    showResults(foundItems, totalFound);
}

function showResults(items, total) {
    const results = document.getElementById('results');
    
    if (total === 0) {
        results.innerHTML = '<div class="no-issues"><h3>✓ No patterns found</h3><p>Your text doesn\'t contain the patterns we\'re looking for!</p></div>';
        return;
    }

    let html = `<div class="summary"><h3>📋 Found ${total} pattern(s)</h3></div>`;
    
    for (let type in items) {
        const typeName = getTypeName(type);
        const riskLevel = getRisk(type);
        
        html += `
            <div class="result-box ${riskLevel}">
                <h4>${typeName} (${items[type].length})</h4>
                <ul>`;
        
        items[type].forEach(item => {
            const masked = maskData(item, type);
            html += `<li>${masked}</li>`;
        });
        
        html += `</ul></div>`;
    }
    
    results.innerHTML = html;
}

function getTypeName(type) {
    const names = {
        emails: 'Email Addresses',
        urls: 'URLs',
        phones: 'Phone Numbers', 
        creditCards: 'Credit Card Numbers',
        time: 'Time Formats',
        htmlTags: 'HTML Tags',
        hashtags: 'Hashtags',
        currency: 'Currency Amounts'
    };
    return names[type] || type;
}

function getRisk(type) {
    const risks = {
        creditCards: 'high-risk',
        emails: 'medium-risk',
        phones: 'medium-risk',
        urls: 'low-risk',
        time: 'low-risk',
        htmlTags: 'low-risk',
        hashtags: 'low-risk',
        currency: 'medium-risk'
    };
    return risks[type] || 'low-risk';
}

function maskData(data, type) {
    if (type === 'creditCards') {
        return data.replace(/\d(?=\d{4})/g, '*');
    }
    return data;
}