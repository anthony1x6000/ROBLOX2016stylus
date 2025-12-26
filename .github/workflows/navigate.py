import sys
import re

def extract_css_comments(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as infile:
            for line_number, line in enumerate(infile, 1):
                comments = re.findall(r'/\*.*?\*/', line)
                for comment in comments:
                    print(f"Line {line_number}: {comment}")

    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python navigate.py <filename>")
    else:
        filename = sys.argv[1]
        extract_css_comments(filename)
