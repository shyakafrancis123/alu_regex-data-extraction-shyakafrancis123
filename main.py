import re

data = """
user@example.com
https://www.example.com
(123) 456-7890
1234 5678 9012 3456
14:30
2:30 PM
<p>Hello</p>
#example
$19.99
"""

# --- Regex Patterns ---
PATTERNS = {
    "emails": re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'),
    "urls": re.compile(r'https?://[^\s<>"]+'),
    "phones": re.compile(r'(\(\d{3}\)\s?\d{3}[-.]\d{4}|\d{3}[-.]\d{3}[-.]\d{4})'),
    "credit_cards": re.compile(r'(\d{4}[- ]?){3}\d{4}'),
    "time": re.compile(r'((1[0-2]|0?[1-9]):[0-5]\d\s?(AM|PM)|([01]?\d|2[0-3]):[0-5]\d)'),
    "html_tags": re.compile(r'<[^>]+>'),
    "hashtags": re.compile(r'#\w+'),
    "currency": re.compile(r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?')
}

def extract_all(text):
    """Return a dictionary of lists with matches for each pattern."""
    results = {}
    for key, pattern in PATTERNS.items():
        matches = pattern.findall(text)
        # pattern.findall sometimes returns tuples, flatten them
        clean = [m if isinstance(m, str) else m[0] for m in matches]
        results[key] = list(set(clean))  # remove duplicates
    return results

if __name__ == "__main__":
    # Example usage with sample_input.txt
    with open("tests/sample_input.txt", "r", encoding="utf-8") as f:
        data = f.read()

    results = extract_all(data)
    for category, items in results.items():
        print(f"\n{category.upper()}:")
        for item in items:
            print(f"  {item}")
if __name__ == "__main__":
    results = extract_all(data)
    for category, items in results.items():
        print(f"\n{category.upper()}:")
        for item in items:
            print(f"  {item}")
