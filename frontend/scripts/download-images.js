const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Image URLs from Unsplash (free to use)
const images = {
  'scanner-hero.jpg': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'profile-hero.jpg': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'job-matcher-hero.jpg': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', error => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(error);
    });
  });
}

// Download all images
async function downloadAllImages() {
  try {
    for (const [filename, url] of Object.entries(images)) {
      const filepath = path.join(imagesDir, filename);
      console.log(`Downloading ${filename}...`);
      await downloadImage(url, filepath);
      console.log(`✓ ${filename} downloaded successfully`);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages();
