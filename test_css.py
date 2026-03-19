import tinycss2
import sys
import re

def normalize_selector(selector_tokens):
    # selector_tokens is a list of tokens from tinycss2
    selector = tinycss2.serialize(selector_tokens)
    # Normalize quotes to double quotes in attribute selectors
    selector = selector.replace("'", '"')
    # Remove extra spaces around combinators but NOT between class/id selectors (descendants)
    selector = re.sub(r'\s*([>+~])\s*', r'\1', selector)
    # Handle commas
    selector = re.sub(r'\s*,\s*', r',', selector)
    # Collapse multiple spaces to a single space
    selector = re.sub(r'\s+', ' ', selector)
    # Normalize pseudoelements :: to :
    selector = selector.replace('::', ':')
    return selector.strip().lower()

def get_rules_map(content):
    rules_map = {}
    # Strip @-moz-document if present
    content = content.strip()
    if content.startswith('@-moz-document'):
        first_brace = content.find('{')
        last_brace = content.rfind('}')
        content = content[first_brace+1:last_brace]
    
    rules = tinycss2.parse_stylesheet(content, skip_comments=True, skip_whitespace=True)
    
    # print(f"DEBUG: Found {len(rules)} rules in stylesheet")
    for rule in rules:
        # print(f"DEBUG: Rule type: {rule.type}")
        if rule.type == 'error':
            print(f"DEBUG: tinycss2 Error in sheet: {rule.message} at line {rule.source_line}, column {rule.source_column}")
            continue
        if rule.type == 'qualified-rule':
            selector = normalize_selector(rule.prelude)
            # Qualified rules can have multiple selectors separated by commas
            selectors = selector.split(',')
            
            # Simple property extraction from rule.content
            # Note: tinycss2 returns a list of tokens for content
            decls = {}
            prop_rules = tinycss2.parse_declaration_list(rule.content, skip_comments=True, skip_whitespace=True)
            for decl in prop_rules:
                if decl.type == 'declaration':
                    name = decl.name.lower()
                    value = tinycss2.serialize(decl.value).strip()
                    decls[name] = value
            
            for s in selectors:
                s = s.strip()
                if s not in rules_map:
                    rules_map[s] = {}
                rules_map[s].update(decls)
        elif rule.type == 'at-rule' and rule.lower_at_keyword == 'media':
            # Handle media rules recursively
            media_text = tinycss2.serialize(rule.prelude).strip()
            # Media content is in rule.content
            sub_rules = tinycss2.parse_rule_list(rule.content, skip_comments=True, skip_whitespace=True)
            for sub_rule in sub_rules:
                if sub_rule.type == 'qualified-rule':
                    selector = normalize_selector(sub_rule.prelude)
                    selectors = selector.split(',')
                    decls = {}
                    prop_rules = tinycss2.parse_declaration_list(sub_rule.content, skip_comments=True, skip_whitespace=True)
                    for decl in prop_rules:
                        if decl.type == 'declaration':
                            name = decl.name.lower()
                            value = tinycss2.serialize(decl.value).strip()
                            decls[name] = value
                    for s in selectors:
                        s = s.strip()
                        full_s = f"@media {media_text} -> {s}"
                        if full_s not in rules_map:
                            rules_map[full_s] = {}
                        rules_map[full_s].update(decls)
    return rules_map

def normalize_value(value):
    if not value: return ""
    # Normalize quotes
    value = value.replace("'", '"')
    # Remove spaces after commas in lists (like font-family)
    value = re.sub(r',\s*', ',', value)
    # Normalize 0px to 0
    value = value.replace('0px', '0')
    # Collapse spaces
    value = re.sub(r'\s+', ' ', value)
    return value.strip().lower()

def compare_styles(orig_map, refac_map):
    errors = []
    
    # Intentional overrides
    overrides = {
        '.css-1ia7jxc-texticonrowtext[data-sdui-text="true"]': {'font-weight': '100'},
        '.css-1ugh0vn-texticonrowtext[data-sdui-text="true"]': {'font-weight': '100'}
    }

    for selector, orig_decls in orig_map.items():
        if selector not in refac_map:
            errors.append(f"Missing selector: {selector}")
            continue
        
        refac_decls = refac_map[selector]
        
        for name, value in orig_decls.items():
            # Check if this is an intentional override
            if selector in overrides and name in overrides[selector]:
                expected = overrides[selector][name]
            else:
                expected = value
            
            refac_value = refac_decls.get(name)
            
            if normalize_value(refac_value) != normalize_value(expected):
                errors.append(f"Property mismatch for selector '{selector}': {name} should be '{expected}' but is '{refac_value}'")
                
    return errors

def main():
    original_path = 'original-stylesheet.css'
    refactored_path = 'stylustheme.css'

    print(f"--- CSS Structural Integrity Test ---")
    
    with open(original_path, 'r', encoding='utf-8') as f:
        orig_content = f.read()
    with open(refactored_path, 'r', encoding='utf-8') as f:
        refac_content = f.read()

    orig_rules = get_rules_map(orig_content)
    refac_rules = get_rules_map(refac_content)

    print(f"  - Original Selectors: {len(orig_rules)}")
    print(f"  - Refactored Selectors: {len(refac_rules)}")

    errors = compare_styles(orig_rules, refac_rules)

    if errors:
        print(f"\n[FAIL] Found {len(errors)} regression(s):")
        for err in errors[:20]:
            print(f"  - {err}")
        if len(errors) > 20:
            print(f"  ... and {len(errors) - 20} more.")
        sys.exit(1)
    else:
        print("\n[PASS] All original selectors and properties are preserved.")
        sys.exit(0)

if __name__ == "__main__":
    main()
