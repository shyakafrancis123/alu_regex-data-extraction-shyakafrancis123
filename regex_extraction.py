# Importing the built-in library for working with regular expressions
import re

def extract_emails(text):
# This pattern will be returning all email addresses .
    pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    return re.findall(pattern, text)

def extract_urls(text):
# This pattern will find all web URLs starting with http or https.
    pattern = r'https?://[^\s<>"]+'
    return re.findall(pattern, text)

def extract_phone_numbers(text):
# This pattern will extract common North-American phone formats
    # Matches (123) 456-7890, 123-456-7890, 123.456.7890
    pattern = re.compile(
        r'\+?\d{1,3}([ .-]?\d{3}){3,4}\b'
    )
    return re.findall(pattern, text)

def extract_hashtags(text):
# This pattern will return the hashtags e.g #example or #ThisIsAHashtag.
    pattern = r'#\w+'
    return re.findall(pattern, text)

def extract_currency(text):
# This will Match US-style currency amounts
    pattern = r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?'
    return re.findall(pattern, text)

def extract_credit_cards(text):
# this pattern will Match 16-digit credit card numbers separated by spaces or dashes
    pattern = r'\b(?:\d{4}[- ]?){3}\d{4}\b'
    return re.findall(pattern, text)

if __name__ == "__main__":
# Read test data from sample.txt and print matches for each category
    with open("sample.txt", "r", encoding="utf-8") as f:
        data = f.read()

    print("Emails:", extract_emails(data))
    print("URLs:", extract_urls(data))
    print("Phone numbers:", extract_phone_numbers(data))
    print("Hashtags:", extract_hashtags(data))
    print("Currency amounts:", extract_currency(data))
    print("Credit card numbers:", extract_credit_cards(data))


