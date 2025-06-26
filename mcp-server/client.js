import { spawn } from '';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the server script from your build
const serverScript = path.join(__dirname, 'dist', 'index.js');


const serverProcess = spawn('node', [serverScript, '--ignore-robots-txt']);

let messageBuffer = '';
let requestSent = false;

serverProcess.stdout.on('data', (data) => {
  const rawData = data.toString();
  console.log(`[Server STDOUT Raw]:\n${rawData.trim()}\n--------------------`);
  messageBuffer += rawData;

  let eolIndex;
  while ((eolIndex = messageBuffer.indexOf('\n')) >= 0) {
    const line = messageBuffer.substring(0, eolIndex).trim();
    messageBuffer = messageBuffer.substring(eolIndex + 1);
    if (line) {
      try {
        const message = JSON.parse(line);
     
        if (message.id === listingDetails.id) {
          if (message.result) {
          } else if (message.error) {
          }
        
        }
      } catch (e) {
     
      }
    }
  }
});

// Listen for errors/logs from the server's stderr
serverProcess.stderr.on('data', (data) => {
  console.error(`[Server STDERR]: ${data.toString().trim()}`);

  // Check if the server is ready based on its stderr message
  if (data.toString().includes('MCP Server running on stdio') && !requestSent) {
    setTimeout(() => {
      
        serverProcess.stdin.write(JSON.stringify(listingDetails) + '\n');
      
        requestSent = true;
    }, 1500); 
  }
});

// Handle server process exit
serverProcess.on('close', (code) => {
  console.log(`[Client] Server process exited with code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('[Client] Failed to start server process.', err);
});

setTimeout(() => {
    if (!requestSent) {
        console.warn('[Client] Fallback: Server readiness on stderr not detected in time, attempting to send request anyway...');
        console.log(`[Client] Sending search request to server stdin: ${JSON.stringify(listingDetails)}`);
        serverProcess.stdin.write(JSON.stringify(listingDetails) + '\n');
        requestSent = true;
    }
}, 5000); 