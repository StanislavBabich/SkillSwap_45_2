const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const destDir = path.join(__dirname, '..', '_nest');
const nestRoot = [distDir, path.join(distDir, 'src')].find((dir) =>
  fs.existsSync(path.join(dir, 'main.js')),
);

if (!nestRoot) {
  throw new Error(
    'Nest build did not produce main.js. Vercel cannot start the API without it.',
  );
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.cpSync(nestRoot, destDir, { recursive: true });

if (!fs.existsSync(path.join(destDir, 'main.js'))) {
  throw new Error('Failed to copy Nest main.js into _nest/');
}

console.log(
  `Copied Nest output from ${path.relative(process.cwd(), nestRoot)} to ${path.relative(process.cwd(), destDir)}`,
);
