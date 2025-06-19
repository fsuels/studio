#\!/bin/bash

# Remove definite duplicates
rm -f templates/affidavit.*
rm -f templates/nda.*
rm -f templates/oil-gas-lease.*
rm -f templates/patent-licensing-agreement.*
rm -f templates/web-development-agreement.*
rm -f templates/offer-letter.*

# Log what was removed
echo "Removed duplicate documents:" >> CLAUDE_MEMORY.md
echo "- affidavit (using affidavit-general instead)" >> CLAUDE_MEMORY.md
echo "- nda (using non-disclosure-agreement instead)" >> CLAUDE_MEMORY.md
echo "- oil-gas-lease (using oil-gas-lease-agreement instead)" >> CLAUDE_MEMORY.md
echo "- patent-licensing-agreement (using patent-license-agreement instead)" >> CLAUDE_MEMORY.md
echo "- web-development-agreement (using website-development-agreement instead)" >> CLAUDE_MEMORY.md
echo "- offer-letter (using employment-offer-letter instead)" >> CLAUDE_MEMORY.md

echo "✅ Cleanup complete. Reduced from 289 to ~283 documents"
