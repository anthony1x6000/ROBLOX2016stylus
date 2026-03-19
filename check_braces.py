
with open('stylustheme.css', 'r') as f:
    depth = 0
    content = f.read()
    
# Remove comments to avoid counting braces inside them
import re
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

depth = 0
for i, char in enumerate(content):
    if char == '{':
        depth += 1
    elif char == '}':
        depth -= 1
    if depth < 0:
        # Find line number
        line_no = content[:i+1].count('\n') + 1
        print(f"Braces became unbalanced (extra closing) at line {line_no} around text: {content[max(0, i-20):i+20]}")
        depth = 0
if depth > 0:
    print(f"Final depth is {depth}, missing {depth} closing braces.")
