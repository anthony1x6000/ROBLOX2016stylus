#!/bin/bash

# CSS Testing Suite
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "======================================"
echo "   ROBLOX 2016 Stylus Test Suite      "
echo "======================================"

# 1. Check if files exist
echo -e "\n[1/4] Checking file existence..."
if [ -f "stylustheme.css" ]; then
    echo -e "${GREEN}[PASS]${NC} stylustheme.css found."
else
    echo -e "${RED}[FAIL]${NC} stylustheme.css NOT found."
    exit 1
fi

if [ -f "original-stylesheet.css" ]; then
    echo -e "${GREEN}[PASS]${NC} original-stylesheet.css found."
else
    echo -e "${RED}[FAIL]${NC} original-stylesheet.css NOT found."
    exit 1
fi

# 2. Syntax Check (Simple grep for unclosed braces or semi-colons)
echo -e "\n[2/4] Basic Syntax Validation..."
# Count opening and closing braces
OPEN_BRACES=$(grep -o "{" stylustheme.css | wc -l)
CLOSE_BRACES=$(grep -o "}" stylustheme.css | wc -l)

if [ "$OPEN_BRACES" -eq "$CLOSE_BRACES" ]; then
    echo -e "${GREEN}[PASS]${NC} Braces are balanced ($OPEN_BRACES)."
else
    echo -e "${RED}[FAIL]${NC} Unbalanced braces: { ($OPEN_BRACES) vs } ($CLOSE_BRACES)."
    # We don't exit here because some valid CSS might confuse this simple check
fi

# 3. URL Verification (Sampled)
echo -e "\n[3/4] Asset URL Verification..."
URLS=$(grep -oE "url\(['\"]?https?://[^'\"\)]+['\"]?\)" stylustheme.css | sed -E "s/url\(['\"]?//;s/['\"]?\)//" | head -n 5)

for url in $URLS; do
    echo -n "Checking $url ... "
    status=$(curl -o /dev/null -s -w "%{http_code}" "$url")
    if [ "$status" -eq 200 ] || [ "$status" -eq 301 ] || [ "$status" -eq 302 ]; then
        echo -e "${GREEN}OK ($status)${NC}"
    else
        echo -e "${RED}FAILED ($status)${NC}"
    fi
done

# 4. Structural Comparison (Python)
echo -e "\n[4/4] Structural Comparison (Python)..."
python3 test_css.py

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}TOTAL SUCCESS: CSS refactoring maintained structural integrity.${NC}"
else
    echo -e "\n${RED}TOTAL FAILURE: Selectors or properties were lost during refactoring.${NC}"
    exit 1
fi

echo "======================================"
