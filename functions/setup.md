# Firebase Functions Setup for Template Embedding

## Prerequisites

1. **Install dependencies:**
   ```bash
   cd functions
   npm install
   ```

2. **Configure OpenAI API Key:**
   ```bash
   firebase functions:config:set openai.key="your-openai-api-key-here"
   ```

3. **Create Pub/Sub Topic:**
   ```bash
   gcloud pubsub topics create embed-templates
   ```

4. **Build functions:**
   ```bash
   npm run build
   ```

5. **Deploy functions:**
   ```bash
   npm run deploy
   ```

## Functions Overview

### 1. `publishTemplateForEmbedding`
- **Trigger:** Firestore `templates/{id}` create/update
- **Action:** Publishes message to `embed-templates` Pub/Sub topic
- **Message:** `{ id: templateId }`

### 2. `embedTemplate`
- **Trigger:** Pub/Sub `embed-templates` topic
- **Action:** 
  1. Fetches template by ID
  2. Checks if embedding already exists
  3. Hashes template text (SHA256, first 512 chars)
  4. Calls OpenAI `text-embedding-3-small` model
  5. Stores Float32Array embedding in Firestore
  6. Logs token usage and write counts

### 3. `embeddingHealthCheck`
- **Trigger:** HTTP request
- **Action:** Checks OpenAI, Firestore, and Pub/Sub connectivity
- **URL:** `https://[region]-[project].cloudfunctions.net/embeddingHealthCheck`

### 4. `bulkEmbedTemplates`
- **Trigger:** HTTP request  
- **Action:** Triggers embedding for up to 100 templates without embeddings
- **URL:** `https://[region]-[project].cloudfunctions.net/bulkEmbedTemplates`

## Features

- **Retry with exponential backoff** for rate limiting (429 errors)
- **Comprehensive logging** with token usage tracking
- **Error handling** with status updates in Firestore
- **Idempotent processing** (skips if embedding exists)
- **Memory optimization** with Float32Array storage
- **Health monitoring** with connectivity checks

## Usage Examples

### Test Health Check
```bash
curl https://us-central1-your-project.cloudfunctions.net/embeddingHealthCheck
```

### Trigger Bulk Embedding
```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/bulkEmbedTemplates
```

### Monitor Logs
```bash
firebase functions:log --only embedTemplate
```

## Monitoring

The system logs:
- Token usage per embedding
- Firestore read/write counts
- Processing times
- Error details with template IDs
- Rate limiting and retry attempts