#!/usr/bin/env npx tsx
/**
 * Interactive Manual Mapping Tool
 * 
 * Launches a simple HTTP server with a PDF viewer for manually mapping
 * coordinates to unmapped form fields by clicking on the PDF.
 * 
 * Usage:
 *   npx tsx scripts/manual-map.ts <pdf-path> --overlay <overlay-json-path>
 * 
 * Example:
 *   npx tsx scripts/manual-map.ts public/forms/vehicle-bill-of-sale/alabama/MVT-32-13B.pdf --overlay public/assets/us/al/vehicle-bill-of-sale/overlay.json
 */

import { promises as fs } from 'fs';
import { join, dirname, resolve, basename } from 'path';
import { createServer } from 'http';
import { parse } from 'url';

interface ManualMapOptions {
  pdfPath: string;
  overlayPath: string;
  port?: number;
}

/**
 * Create the HTML page for manual mapping
 */
async function createHtmlPage(pdfPath: string, overlayPath: string): Promise<string> {
  const pdfName = basename(pdfPath);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual Mapping Tool</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        .field-box {
            position: absolute;
            border: 2px solid;
            border-radius: 4px;
            pointer-events: none;
            opacity: 0.7;
            padding: 2px 4px;
            font-size: 10px;
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        
        .field-box.coordinate {
            border-color: #10b981;
            background-color: rgba(16, 185, 129, 0.1);
            color: #059669;
        }
        
        .field-box.acroform {
            border-color: #3b82f6;
            background-color: rgba(59, 130, 246, 0.1);
            color: #2563eb;
        }
        
        .field-box.auto {
            border-color: #f59e0b;
            background-color: rgba(245, 158, 11, 0.1);
            color: #d97706;
        }
        
        .field-box.new {
            border-color: #ef4444;
            background-color: rgba(239, 68, 68, 0.1);
            color: #dc2626;
        }
        
        #pdf-container {
            position: relative;
            display: inline-block;
            border: 1px solid #d1d5db;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .canvas-layer {
            display: block;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <div class="w-80 bg-white shadow-lg p-6 overflow-y-auto">
            <h1 class="text-2xl font-bold mb-6 text-gray-800">Manual Mapping Tool</h1>
            
            <div class="mb-6">
                <h2 class="text-lg font-semibold mb-3">Instructions</h2>
                <ul class="text-sm text-gray-600 space-y-2">
                    <li>• Click on the PDF where the field should be positioned</li>
                    <li>• <span class="text-green-600">Green boxes</span> = existing coordinates</li>
                    <li>• <span class="text-blue-600">Blue boxes</span> = AcroForm fields</li>
                    <li>• <span class="text-orange-600">Orange boxes</span> = auto-generated</li>
                    <li>• <span class="text-red-600">Red boxes</span> = newly mapped</li>
                    <li>• Press <kbd class="bg-gray-200 px-1 rounded">ESC</kbd> to quit</li>
                </ul>
            </div>

            <div class="mb-6">
                <h2 class="text-lg font-semibold mb-3">Active Field</h2>
                <div id="active-field-display" class="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div id="active-field-name" class="font-medium text-blue-800">Loading...</div>
                    <div class="text-sm text-blue-600 mt-1">Click on PDF to map this field</div>
                </div>
            </div>

            <div class="mb-6">
                <h2 class="text-lg font-semibold mb-3">Unmapped Fields (<span id="unmapped-count">0</span>)</h2>
                <div id="unmapped-list" class="space-y-1">
                    <!-- Populated by JavaScript -->
                </div>
            </div>

            <div class="mb-4">
                <h2 class="text-lg font-semibold mb-3">Controls</h2>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <label class="text-sm">Page:</label>
                        <select id="page-select" class="px-2 py-1 border rounded text-sm">
                            <option value="1">Page 1</option>
                        </select>
                    </div>
                    <div class="flex items-center justify-between">
                        <label class="text-sm">Zoom:</label>
                        <select id="zoom-select" class="px-2 py-1 border rounded text-sm">
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1.0" selected>100%</option>
                            <option value="1.25">125%</option>
                            <option value="1.5">150%</option>
                        </select>
                    </div>
                    <button id="save-btn" class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
                        Save Progress
                    </button>
                </div>
            </div>
            
            <div class="text-xs text-gray-500 mt-4">
                <div>PDF: ${pdfName}</div>
                <div>Overlay: ${basename(overlayPath)}</div>
            </div>
        </div>

        <!-- PDF Viewer -->
        <div class="flex-1 p-6 overflow-auto">
            <div id="pdf-container">
                <canvas id="pdf-canvas" class="canvas-layer"></canvas>
            </div>
        </div>
    </div>

    <script>
        // Configure PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        let pdfDoc = null;
        let pageNum = 1;
        let pageIsRendering = false;
        let pageNumIsPending = null;
        let scale = 1.0;
        let overlay = null;
        let unmappedFields = [];
        let activeField = null;
        let fieldBoxes = [];
        
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('pdf-container');
        
        // All possible fields (normally would come from API)
        const allFields = [
            'state', 'seller_name', 'seller_phone', 'seller_address',
            'buyer_name', 'buyer_phone', 'buyer_address', 'seller2_name',
            'buyer2_name', 'year', 'make', 'model', 'vin', 'color', 'body_type',
            'price', 'sale_date', 'odometer', 'odo_status', 'title_number', 
            'county', 'current_title_date', 'existing_liens', 'as_is', 'warranty_text'
        ];

        // Load overlay data
        async function loadOverlay() {
            try {
                const response = await fetch('/api/overlay');
                overlay = await response.json();
                
                // Calculate unmapped fields
                const mapped = new Set();
                if (overlay.fieldMapping) {
                    Object.keys(overlay.fieldMapping).forEach(key => mapped.add(key));
                }
                if (overlay.coordinates) {
                    Object.keys(overlay.coordinates).forEach(key => mapped.add(key));
                }
                
                unmappedFields = allFields.filter(field => !mapped.has(field));
                activeField = unmappedFields[0] || null;
                
                updateUI();
                createFieldBoxes();
            } catch (error) {
                console.error('Failed to load overlay:', error);
            }
        }

        // Update UI elements
        function updateUI() {
            document.getElementById('unmapped-count').textContent = unmappedFields.length;
            
            if (activeField) {
                document.getElementById('active-field-name').textContent = activeField;
                document.getElementById('active-field-display').className = 'p-3 bg-blue-50 rounded-lg border-2 border-blue-200';
            } else {
                document.getElementById('active-field-name').textContent = '✓ All fields mapped!';
                document.getElementById('active-field-display').className = 'p-3 bg-green-50 rounded-lg border-2 border-green-200';
            }
            
            // Update unmapped list
            const listEl = document.getElementById('unmapped-list');
            listEl.innerHTML = '';
            unmappedFields.forEach(field => {
                const btn = document.createElement('button');
                btn.className = \`w-full text-left px-3 py-2 rounded text-sm \${field === activeField ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}\`;
                btn.textContent = field;
                btn.onclick = () => {
                    activeField = field;
                    updateUI();
                };
                listEl.appendChild(btn);
            });
        }

        // Create visual field boxes
        function createFieldBoxes() {
            // Remove existing boxes
            document.querySelectorAll('.field-box').forEach(el => el.remove());
            
            if (!overlay?.coordinates) return;
            
            Object.entries(overlay.coordinates).forEach(([id, coord]) => {
                if (coord.page === pageNum - 1) {
                    createFieldBox(id, coord.x * scale, coord.y * scale, coord.auto ? 'auto' : 'coordinate');
                }
            });
        }

        // Create a single field box
        function createFieldBox(questionId, x, y, type) {
            const box = document.createElement('div');
            box.className = \`field-box \${type}\`;
            box.textContent = questionId;
            box.style.left = \`\${x}px\`;
            box.style.top = \`\${y}px\`;
            box.style.width = '100px';
            box.style.height = '20px';
            container.appendChild(box);
        }

        // Render PDF page
        async function renderPage(num) {
            pageIsRendering = true;
            
            try {
                const page = await pdfDoc.getPage(num);
                const viewport = page.getViewport({ scale });
                
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                pageIsRendering = false;
                
                if (pageNumIsPending !== null) {
                    renderPage(pageNumIsPending);
                    pageNumIsPending = null;
                }
                
                createFieldBoxes();
            } catch (error) {
                console.error('Error rendering page:', error);
                pageIsRendering = false;
            }
        }

        // Queue render page
        function queueRenderPage(num) {
            if (pageIsRendering) {
                pageNumIsPending = num;
            } else {
                renderPage(num);
            }
        }

        // Handle PDF click
        function handlePDFClick(event) {
            if (!activeField || !overlay) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = Math.round((event.clientX - rect.left) / scale);
            const y = Math.round((event.clientY - rect.top) / scale);
            
            // Add to overlay coordinates
            if (!overlay.coordinates) overlay.coordinates = {};
            overlay.coordinates[activeField] = {
                page: pageNum - 1,
                x: x,
                y: canvas.height / scale - y, // PDF coordinates are bottom-up
                fontSize: 10,
                auto: false
            };
            
            // Save to server
            saveOverlay();
            
            // Update UI
            unmappedFields = unmappedFields.filter(f => f !== activeField);
            activeField = unmappedFields[0] || null;
            updateUI();
            
            // Add visual box
            createFieldBox(activeField || 'new', event.clientX - rect.left, event.clientY - rect.top, 'new');
            
            console.log(\`Mapped to (\${x}, \${canvas.height / scale - y})\`);
        }

        // Save overlay to server
        async function saveOverlay() {
            try {
                await fetch('/api/overlay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(overlay)
                });
            } catch (error) {
                console.error('Failed to save overlay:', error);
            }
        }

        // Event listeners
        canvas.addEventListener('click', handlePDFClick);
        
        document.getElementById('page-select').addEventListener('change', (e) => {
            pageNum = parseInt(e.target.value);
            queueRenderPage(pageNum);
        });
        
        document.getElementById('zoom-select').addEventListener('change', (e) => {
            scale = parseFloat(e.target.value);
            queueRenderPage(pageNum);
        });
        
        document.getElementById('save-btn').addEventListener('click', saveOverlay);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (confirm('Are you sure you want to quit?')) {
                    window.close();
                }
            }
        });

        // Initialize
        async function init() {
            try {
                pdfDoc = await pdfjsLib.getDocument('/pdf/${basename(pdfPath)}').promise;
                
                // Update page selector
                const pageSelect = document.getElementById('page-select');
                pageSelect.innerHTML = '';
                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = \`Page \${i}\`;
                    pageSelect.appendChild(option);
                }
                
                await loadOverlay();
                renderPage(pageNum);
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        }
        
        init();
    </script>
</body>
</html>
`;
}

/**
 * Start the simple HTTP server
 */
async function startDevServer(options: ManualMapOptions) {
  const { pdfPath, overlayPath, port = 3001 } = options;
  
  console.log('🔧 Setting up manual mapping tool...');
  
  const htmlContent = await createHtmlPage(pdfPath, overlayPath);
  
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      // Serve main HTML page
      if (pathname === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(htmlContent);
        return;
      }

      // API endpoint for overlay operations
      if (pathname === '/api/overlay') {
        if (req.method === 'GET') {
          try {
            const overlayContent = await fs.readFile(resolve(overlayPath), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(overlayContent);
          } catch (error) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Overlay file not found' }));
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const overlayData = JSON.parse(body);
              await fs.writeFile(resolve(overlayPath), JSON.stringify(overlayData, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.writeHead(200);
              res.end(JSON.stringify({ success: true }));
              console.log(`✅ Updated overlay: ${basename(overlayPath)}`);
            } catch (error) {
              res.writeHead(500);
              res.end(JSON.stringify({ error: 'Failed to save overlay' }));
            }
          });
        }
        return;
      }

      // Serve PDF file
      if (pathname === `/pdf/${basename(pdfPath)}`) {
        try {
          const pdfContent = await fs.readFile(resolve(pdfPath));
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Length', pdfContent.length.toString());
          res.writeHead(200);
          res.end(pdfContent);
        } catch (error) {
          res.writeHead(404);
          res.end('PDF not found');
        }
        return;
      }

      // 404 for other routes
      res.writeHead(404);
      res.end('Not found');

    } catch (error) {
      console.error('Server error:', error);
      res.writeHead(500);
      res.end('Internal server error');
    }
  });

  server.listen(port, () => {
    console.log(`🚀 Manual mapping tool running at: http://localhost:${port}`);
    console.log(`📄 PDF: ${basename(pdfPath)}`);
    console.log(`🗂️  Overlay: ${basename(overlayPath)}`);
    console.log('🎯 Click on PDF to map unmapped fields');
    console.log('⌨️  Press ESC in browser to quit');
    console.log('⌨️  Press Ctrl+C here to stop server');
  });

  // Cleanup function
  const cleanup = () => {
    console.log('\n🧹 Shutting down server...');
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log('Usage: npx tsx scripts/manual-map.ts <pdf-path> --overlay <overlay-json-path>');
    console.log('');
    console.log('Options:');
    console.log('  --overlay <path>    Path to overlay.json file');
    console.log('  --port <number>     Port for dev server (default: 3001)');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/manual-map.ts public/forms/vehicle-bill-of-sale/alabama/MVT-32-13B.pdf \\');
    console.log('    --overlay public/assets/us/al/vehicle-bill-of-sale/overlay.json');
    process.exit(args[0] === '--help' ? 0 : 1);
  }
  
  const pdfPath = args[0];
  let overlayPath: string | undefined;
  let port = 3001;
  
  // Parse command line options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--overlay' && i + 1 < args.length) {
      overlayPath = args[i + 1];
      i++;
    } else if (args[i] === '--port' && i + 1 < args.length) {
      port = parseInt(args[i + 1]);
      i++;
    }
  }
  
  if (!overlayPath) {
    console.error('❌ --overlay option is required');
    process.exit(1);
  }
  
  // Validate files exist
  try {
    await fs.access(pdfPath);
    await fs.access(overlayPath);
  } catch (error) {
    console.error(`❌ File not found: ${(error as any).path}`);
    process.exit(1);
  }
  
  try {
    await startDevServer({ pdfPath, overlayPath, port });
  } catch (error) {
    console.error('❌ Error starting manual mapping tool:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { startDevServer };