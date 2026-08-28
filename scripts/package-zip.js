/**
 * Automated Project Packaging & Compression Utility
 * Creates omnicommerce-enterprise.zip in project root
 * OmniCommerce Enterprise
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const zipFileName = 'omnicommerce-enterprise.zip';
const zipPath = path.join(projectRoot, zipFileName);

function packageProject() {
  console.log('====================================================');
  console.log('  Packaging Project into Zip Archive...');
  console.log('====================================================');

  if (fs.existsSync(zipPath)) {
    console.log(`Removing existing ${zipFileName}...`);
    fs.unlinkSync(zipPath);
  }

  // PowerShell command selecting all items except node_modules, .git, and .zip files
  const command = `powershell -Command "Get-ChildItem -Path '${projectRoot}' -Exclude 'node_modules','.git','*.zip' | Compress-Archive -DestinationPath '${zipPath}' -Force"`;

  try {
    console.log('Executing zip compression...');
    execSync(command, { cwd: projectRoot, stdio: 'inherit' });
    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`Successfully generated: ${zipFileName} (${sizeKB} KB)`);
    } else {
      console.error('Zip creation failed: file not found after command.');
    }
  } catch (err) {
    console.error('Error during zip packaging:', err.message);
  }
}

if (require.main === module) {
  packageProject();
}

module.exports = packageProject;
