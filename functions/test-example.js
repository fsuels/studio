// functions/test-example.js
// Example test script for the embedding functions

const { PubSub } = require('@google-cloud/pubsub');

async function testPublishMessage() {
  console.log('Testing Pub/Sub message publishing...');
  
  try {
    const pubsub = new PubSub();
    const topic = pubsub.topic('embed-templates');
    
    // Check if topic exists
    const [exists] = await topic.exists();
    if (!exists) {
      console.log('Creating embed-templates topic...');
      await topic.create();
    }
    
    // Publish test message
    const message = { id: 'test-template-123' };
    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    const messageId = await topic.publishMessage({ data: messageBuffer });
    console.log(`Test message published with ID: ${messageId}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testEmbeddingFormat() {
  console.log('Testing embedding format...');
  
  // Mock embedding response format
  const mockEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
  const float32Embedding = new Float32Array(mockEmbedding);
  
  console.log('Embedding dimensions:', float32Embedding.length);
  console.log('Sample values:', Array.from(float32Embedding.slice(0, 5)));
  console.log('Firestore format:', Array.from(float32Embedding.slice(0, 5)));
}

async function runTests() {
  console.log('=== Function Tests ===\n');
  
  await testEmbeddingFormat();
  console.log('');
  
  // Only run Pub/Sub test if credentials are available
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT) {
    await testPublishMessage();
  } else {
    console.log('Skipping Pub/Sub test (no credentials)');
  }
  
  console.log('\n=== Tests Complete ===');
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testPublishMessage, testEmbeddingFormat };