const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const siblingDomains = [
  'acdn.adnxs.com',
  'acuityplatform.com',
  'ajax.googleapis.com',
  'blueskybooking.blob.core.windows.net',
  'bookings.blueskybooking.com',
  'cdn.trustindex.io',
  'cdnjs.cloudflare.com',
  'connect.facebook.net',
  'e.issuu.com',
  'employee.helijet.com',
  'fonts.googleapis.com',
  'ib.adnxs.com',
  'ifr-helijet.com',
  'instagram.com',
  'maxcdn.bootstrapcdn.com',
  'officedoxscdn.blob.core.windows.net',
  'seal-mbc.bbb.org',
  'secure.adnxs.com',
  'secure.gravatar.com',
  'stats.wp.com',
  'twitter.com',
  'v0.wordpress.com',
  'web.facebook.com',
  'wp.me',
  'www.bbb.org',
  'www.canada.ca',
  'www.facebook.com',
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'www.instagram.com',
  'www.linkedin.com'
];

const workspaceRoot = path.resolve(__dirname, '..');
const helijetDir = path.join(workspaceRoot, 'helijet.it.com');

console.log('Workspace Root:', workspaceRoot);
console.log('Helijet Dir:', helijetDir);

// 1. Delete root index.html if it exists
const rootIndex = path.join(workspaceRoot, 'index.html');
if (fs.existsSync(rootIndex)) {
  console.log('Deleting root redirect index.html');
  try {
    execSync('git rm -f index.html', { cwd: workspaceRoot });
  } catch (e) {
    fs.unlinkSync(rootIndex);
  }
}

// 2. Move everything inside helijet.it.com to workspace root
if (fs.existsSync(helijetDir)) {
  const items = fs.readdirSync(helijetDir);
  for (const item of items) {
    const src = path.join(helijetDir, item);
    const dest = path.join(workspaceRoot, item);
    console.log(`Moving: helijet.it.com/${item} -> ${item}`);
    
    try {
      execSync(`git mv "helijet.it.com/${item}" "${item}"`, { cwd: workspaceRoot, stdio: 'inherit' });
    } catch (e) {
      console.log(`git mv failed, trying fs.renameSync for ${item}`);
      if (fs.existsSync(dest)) {
        if (fs.statSync(dest).isDirectory()) {
          // If folder exists, we don't overwrite
        } else {
          fs.unlinkSync(dest);
        }
      }
      fs.renameSync(src, dest);
      try {
        execSync(`git add "${item}"`, { cwd: workspaceRoot });
      } catch (e2) {}
    }
  }
  
  // Try to remove helijet.it.com dir if empty
  try {
    fs.rmdirSync(helijetDir);
    console.log('Removed empty helijet.it.com directory.');
  } catch (e) {
    console.log('Could not remove helijet.it.com directory:', e.message);
  }
}

// 3. Process files recursively to update relative paths
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

const fileExtensions = ['.html', '.css', '.js', '.json', '.xml', '.svg'];

walkDir(workspaceRoot, (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!fileExtensions.includes(ext)) {
    return;
  }
  
  // Calculate relative path from workspace root
  const relPath = path.relative(workspaceRoot, filePath);
  // Skip files that are inside sibling domains
  const topDir = relPath.split(path.sep)[0];
  if (siblingDomains.includes(topDir)) {
    return;
  }
  
  // Calculate depth N
  const parts = relPath.split(path.sep);
  const N = parts.length - 1; // e.g. index.html N=0, booking/index.html N=1
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Update relative sibling domain paths
  siblingDomains.forEach(domain => {
    const escapedDomain = domain.replace(/\./g, '\\.');
    const oldPrefix = '\\.\\.\\/'.repeat(N + 1);
    const newPrefix = '../'.repeat(N);
    
    const regex = new RegExp('(["\'\\\\(/])' + oldPrefix + '(' + escapedDomain + ')\\b', 'g');
    content = content.replace(regex, '$1' + newPrefix + '$2');
  });
  
  // Replace absolute references like /helijet.it.com/ with /
  content = content.replace(/\/helijet\.it\.com\//g, '/');
  
  // Replace absolute domain URLs with relative/root-relative paths
  content = content.replace(/https?:\/\/helijet\.it\.com\//g, '/');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated paths in: ${relPath} (depth: ${N})`);
  }
});

console.log('Path correction complete!');
