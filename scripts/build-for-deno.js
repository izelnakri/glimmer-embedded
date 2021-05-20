import fs from 'fs/promises';
import esbuild from 'esbuild';
import './dedupe.js';

const res = await esbuild.build({
  entryPoints: ['./ssr/index.js'],
  platform: "node",
  bundle: true,
  outfile: 'dist/index.js'
});
await fs.writeFile('dist/package.json', JSON.stringify({
  name: 'ssr'
}, null, 2));
