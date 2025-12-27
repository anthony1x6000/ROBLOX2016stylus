import subprocess
import re
import sys


def get_source_code(url):
    """
    Mimics 'wget -q -O - url'. 
    Fetches the raw HTML source code of the URL.
    """
    # -q: Quiet, -O -: Output to stdout, -U: User Agent
    cmd = ["wget", "-q", "-O", "-", "-U", "Mozilla/5.0", url]
    
    try:
        # text=True decodes the output to a string automatically
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            return ""
        return result.stdout
    except FileNotFoundError:
        return ""


def grep(source_code, search_string):
    """
    Mimics 'grep "search_string"'.
    Returns the first line in the source_code that contains the search_string.
    """
    if not source_code:
        return None
        
    for line in source_code.splitlines():
        if search_string in line:
            # strip() removes leading/trailing whitespace for cleaner output
            return line.strip()
            
    return None


def extract_number(html_line):
    """
    Parses the number from an HTML line.
    Target format: <p ...>...</span>1148</p>
    """
    if not html_line:
        return None
        
    # Regex logic:
    # >         : Matches the end of the previous tag (e.g., </span>)
    # \s*       : Matches optional whitespace
    # ([\d,]+)  : Group 1: Matches one or more digits and commas
    # \s*       : Matches optional whitespace
    # </        : Matches the start of the closing tag (e.g., </p>)
    pattern = r'>\s*([\d,]+)\s*</'
    
    match = re.search(pattern, html_line)
    if match:
        # Return the number (removing commas if present)
        return match.group(1).replace(',', '')
    
    return None


if __name__ == "__main__":
    # Ensure correct number of arguments are passed
    if len(sys.argv) < 3:
        print('Usage: python3 main.py <URL> "<search_string>"')
        sys.exit(1)

    # 1. Get arguments from command line
    target_url = sys.argv[1]
    search_term = sys.argv[2]

    source = get_source_code(target_url)

    # 2. Grep for the specific line
    matched_line = grep(source, search_term)

    if matched_line:
        # 3. Extract the number
        number = extract_number(matched_line)
        if number:
            print(number)
