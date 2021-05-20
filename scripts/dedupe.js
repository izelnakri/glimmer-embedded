import fs from 'fs/promises';

await Promise.all([
  '@glimmer/ssr',
  '@glimmer/node',
  '@glimmer/core'
].map(async (pkgName) => {
  await fs.rm(`node_modules/${pkgName}/node_modules`, { recursive: true });
}));
