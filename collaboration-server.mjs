// collaboration-server.mjs
import { createServer } from 'http';
import next from 'next';
import { startCollaborationServer } from './src/lib/collaboration/server.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000');

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  try {
    console.log('🚀 Starting application servers...');

    // Prepare Next.js app
    await app.prepare();

    // Start collaboration server on separate port
    if (process.env.ENABLE_COLLABORATION === 'true') {
      console.log('🔄 Starting collaboration server...');
      await startCollaborationServer();
    }

    // Create HTTP server for Next.js
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    server.listen(port, () => {
      console.log(`🌟 Next.js server ready on http://${hostname}:${port}`);

      if (process.env.ENABLE_COLLABORATION === 'true') {
        console.log(
          `🤝 Collaboration server ready on port ${process.env.COLLABORATION_PORT || 3001}`,
        );
        console.log('📊 Real-time collaboration features enabled');
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
}

main();
