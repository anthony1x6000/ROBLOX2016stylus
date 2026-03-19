# ROBLOX 2016 Stylus Test Suite Instructions

This test suite is designed to ensure structural integrity and syntax correctness of the ROBLOX 2016 Stylus CSS theme during refactoring.

## Files
- `gitignore-hide/bash_tests.sh`: Orchestrates the testing process.
- `gitignore-hide/test_css.py`: Performs deep structural comparison between the original and refactored CSS.
- `gitignore-hide/check_braces.py`: A simple utility to check for balanced braces.

## Prerequisites
- Python 3
- `tinycss2` library: `pip install tinycss2`

## Running Tests

### Standard Test
To run the full test suite against `original-stylesheet.css` and `stylustheme.css`:
```bash
bash gitignore-hide/bash_tests.sh
```

### Chunk Testing
To test individual chunks (e.g., `chunk_01`):
1. Ensure `original_chunks/chunk_01` and `stylustheme_chunks/chunk_01` exist.
2. Run the structural comparison specifically on these files:
```bash
python3 gitignore-hide/test_css.py original_chunks/chunk_01 stylustheme_chunks/chunk_01
```
*(Note: `test_css.py` may need to be updated to accept command-line arguments for file paths.)*

## Test Criteria
1. **File Existence**: Both target files must be present.
2. **Syntax Validation**: Braces must be balanced.
3. **Asset URLs**: Sampled URLs must be reachable (HTTP 200/301/302).
4. **Structural Integrity**: All selectors and properties from the original must be present in the refactored version (unless explicitly overridden in the script).
