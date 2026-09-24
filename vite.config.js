import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Custom Vite plugin to save updated Sellers, Buyers, and Goods directly to src/data/*.json files on disk
function saveJsonPlugin() {
  return {
    name: 'save-json-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url.startsWith('/api/save-')) {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const target = req.url.replace('/api/save-', ''); // 'sellers', 'buyers', or 'goods'
              const dataDir = path.resolve(process.cwd(), 'src/data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              const filePath = path.join(dataDir, `${target}.json`);
              const parsedData = JSON.parse(body);
              fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, file: `${target}.json` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), saveJsonPlugin()],
});
