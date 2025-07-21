#!/bin/bash

# Script to create all remaining construction documents

BASE_DIR="/mnt/c/Users/Fsuels/OneDrive/Desktop/123legaldoc/studio-master/src/lib/documents/us"

# Array of remaining documents to create
DOCUMENTS=(
    "architect-contract"
    "construction-management-agreement" 
    "bid-proposal"
    "construction-bid-form"
    "performance-bond"
    "payment-bond"
    "certificate-substantial-completion"
    "notice-to-proceed"
    "mechanics-lien"
    "mechanics-lien-waiver"
)

for doc in "${DOCUMENTS[@]}"; do
    echo "Creating $doc..."
    
    # Create directory
    mkdir -p "$BASE_DIR/$doc"
    
    # Create index.ts
    cat > "$BASE_DIR/$doc/index.ts" << EOF
// src/lib/documents/us/$doc/index.ts
export { ${doc//-/}Meta } from './metadata';
export { ${doc//-/}Schema } from './schema';
export { ${doc//-/}Questions } from './questions';
EOF
    
    echo "Created $doc directory and index.ts"
done

echo "All document directories and index files created!"