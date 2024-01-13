const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'src/portal/scripts/app/views';
const destDir = 'dist/views';

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

execSync(`cp -r ${srcDir}/* ${destDir}`);