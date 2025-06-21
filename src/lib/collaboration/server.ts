// src/lib/collaboration/server.ts
import YjsCollaborationServer from './yjs-server';

let collaborationServer: YjsCollaborationServer | null = null;

export async function startCollaborationServer(): Promise<void> {
  if (collaborationServer) {
    console.log('Collaboration server already running');
    return;
  }

  try {
    collaborationServer = new YjsCollaborationServer();
    await collaborationServer.start();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down collaboration server...');
      if (collaborationServer) {
        await collaborationServer.stop();
        process.exit(0);
      }
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down collaboration server...');
      if (collaborationServer) {
        await collaborationServer.stop();
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Failed to start collaboration server:', error);
    throw error;
  }
}

export async function stopCollaborationServer(): Promise<void> {
  if (collaborationServer) {
    await collaborationServer.stop();
    collaborationServer = null;
  }
}

export function getCollaborationServer(): YjsCollaborationServer | null {
  return collaborationServer;
}

// Auto-start in production
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_COLLABORATION === 'true') {
  startCollaborationServer().catch(console.error);
}