/**
 * Automated Project Packaging & Compression Utility
 * Includes .git directory for TrainPlex history verification
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
  console.log('  Packaging Project into Zip Archive (including .git)...');
  console.log('====================================================');

  if (fs.existsSync(zipPath)) {
    console.log(`Removing existing ${zipFileName}...`);
    fs.unlinkSync(zipPath);
  }

  // Include .git folder for TrainPlex git history validation
  const command = `powershell -Command "Get-ChildItem -Path '${projectRoot}' -Force -Exclude 'node_modules','*.zip' | Compress-Archive -DestinationPath '${zipPath}' -Force"`;

  try {
    console.log('Executing zip compression...');
    execSync(command, { cwd: projectRoot, stdio: 'inherit' });
    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`Successfully generated: ${zipFileName} (${sizeMB} MB with .git)`);
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
