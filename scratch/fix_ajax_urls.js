const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (f === '.git' || f === 'node_modules' || f === 'scratch') {
      return;
    }
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const fileExtensions = ['.html', '.css', '.js', '.json'];

walkDir(workspaceRoot, (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!fileExtensions.includes(ext)) {
    return;
  }
  
  const relPath = path.relative(workspaceRoot, filePath);
  const parts = relPath.split(path.sep);
  const N = parts.length - 1;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  const relRoot = '../'.repeat(N);
  
  // Replace https://wp-admin/ with the relative path to wp-admin/
  content = content.replace(/https:\/\/wp-admin\//g, relRoot + 'wp-admin/');
  
  // Replace index.html\/\\/helijet.it.com\/wp-admin\/ with relative path to wp-admin/ (escaped)
  const escapedRelRoot = relRoot.replace(/\//g, '\\/');
  content = content.replace(/index\.html\\\/\\\/helijet\.it\.com\\\/wp-admin\\\//g, escapedRelRoot + 'wp-admin\\/');
  
  // Replace index.html//helijet.it.com/wp-admin/
  content = content.replace(/index\.html\/\/helijet\.it\.com\/wp-admin\//g, relRoot + 'wp-admin/');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed AJAX URLs in: ${relPath}`);
  }
});
