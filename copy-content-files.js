const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'src/portal/content';
const destDir = 'dist/portal/content';

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

execSync(`cp -r ${srcDir}/* ${destDir}`);