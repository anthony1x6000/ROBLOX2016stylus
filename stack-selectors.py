import sys
import re

# AI DISCLAIMER: script was generated with AI

def format_css(text):
    # Normalize whitespace. (This will also safely flatten multi-line comments into single lines).
    text = ' '.join(text.split())
    
    output = []
    indent = 0
    depth = 0
    in_string = False
    string_char = ''
    in_comment = False
    
    TAB = '\t' 
    skip_next_space = False
    
    def is_selector_comma(start_idx):
        # Scan ahead to see if this comma belongs to a selector list or a property list.
        # Now safely skips over strings AND comments.
        in_str = False
        s_char = ''
        in_comm = False
        
        j = start_idx + 1
        while j < len(text):
            c = text[j]
            
            if in_comm:
                if c == '*' and j + 1 < len(text) and text[j+1] == '/':
                    in_comm = False
                    j += 1 # skip the '/'
                j += 1
                continue
                
            if not in_str and c == '/' and j + 1 < len(text) and text[j+1] == '*':
                in_comm = True
                j += 2
                continue

            if in_str:
                if c == s_char and text[j-1] != '\\':
                    in_str = False
                j += 1
                continue
                
            if c in '"\'':
                in_str = True
                s_char = c
                j += 1
                continue
            
            if c == '{':
                return True
            if c in ';}':
                return False
                
            j += 1
        return False
    
    i = 0
    while i < len(text):
        char = text[i]
        
        if skip_next_space and char == ' ':
            skip_next_space = False
            i += 1
            continue
            
        skip_next_space = False
        
        # --- Comment Handling ---
        if in_comment:
            if char == '*' and i + 1 < len(text) and text[i+1] == '/':
                in_comment = False
                output.append("*/")
                # Force a clean line break after the comment if we aren't inside a property/bracket
                if depth == 0:
                    output.append("\n" + (TAB * indent))
                    skip_next_space = True
                i += 2
            else:
                output.append(char)
                i += 1
            continue
            
        if not in_string and char == '/' and i + 1 < len(text) and text[i+1] == '*':
            in_comment = True
            output.append("/*")
            i += 2
            continue
        # ------------------------
        
        # Strings
        if in_string:
            output.append(char)
            if char == string_char and text[i-1] != '\\':
                in_string = False
            i += 1
            continue
            
        if char in '"\'':
            in_string = True
            string_char = char
            output.append(char)
            
        # Brackets / Parentheses
        elif char in "[(":
            depth += 1
            output.append(char)
        elif char in "])":
            depth = max(0, depth - 1)
            output.append(char)
            
        # Structure
        elif char == "{":
            indent += 1
            output.append(" {\n" + (TAB * indent))
            skip_next_space = True
            
        elif char == "}":
            indent = max(0, indent - 1)
            while output and output[-1] in (' ', '\t', '\n'):
                output.pop()
            output.append("\n" + (TAB * indent) + "}\n\n")
            skip_next_space = True
            
        elif char == ";":
            if depth == 0:
                output.append(";\n" + (TAB * indent))
                skip_next_space = True
            else:
                output.append(";")
                
        # Commas
        elif char == ",":
            if depth > 0:
                output.append(",")
            else:
                if is_selector_comma(i):
                    output.append(",\n" + (TAB * indent))
                    skip_next_space = True
                else:
                    output.append(", ")
                    skip_next_space = True
                    
        else:
            output.append(char)
            
        i += 1

    result = "".join(output)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip() + "\n"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
        
    try:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            print(format_css(f.read()))
    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")