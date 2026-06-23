const db = require('./db');
const cloudinary = require('./cloudinaryConfig');
const fs = require('fs');
const path = require('path');

async function migrateImages() {
  console.log("Starting image migration to Cloudinary...");

  // Migrate Menu Images
  try {
    const [menuItems] = await db.promise().query("SELECT id, image_url FROM menu WHERE image_url IS NOT NULL AND image_url != '' AND image_url NOT LIKE '%cloudinary.com%'");
    
    console.log(`Found ${menuItems.length} menu items to migrate.`);
    for (const item of menuItems) {
      let localPath = item.image_url;
      if (localPath.startsWith('/')) {
        localPath = localPath.substring(1);
      }
      
      const absolutePath = path.join(__dirname, localPath);
      
      if (fs.existsSync(absolutePath)) {
        try {
          console.log(`Uploading ${localPath} for menu item ${item.id}...`);
          const result = await cloudinary.uploader.upload(absolutePath, { folder: 'menu_images' });
          
          await db.promise().query("UPDATE menu SET image_url = ? WHERE id = ?", [result.secure_url, item.id]);
          console.log(`Updated menu item ${item.id} with Cloudinary URL.`);
        } catch (uploadErr) {
          console.error(`Failed to upload ${localPath}:`, uploadErr.message);
        }
      } else {
        console.warn(`File not found: ${absolutePath}`);
      }
    }
  } catch (err) {
    console.error("Error migrating menu images:", err.message);
  }

  // Migrate Users/Vendors/Delivery Boy images
  const userTypes = [
    { table: 'users', folder: 'user_profiles' },
    { table: 'vendors', folder: 'user_profiles' },
    { table: 'delivery', folder: 'user_profiles' }
  ];

  for (const ut of userTypes) {
    try {
      const [records] = await db.promise().query(`SELECT id, image FROM ${ut.table} WHERE image IS NOT NULL AND image != '' AND image NOT LIKE '%cloudinary.com%' AND image NOT LIKE '%main.jpg%'`);
      
      console.log(`Found ${records.length} ${ut.table} profiles to migrate.`);
      for (const item of records) {
        let localPath = item.image;
        if (localPath.startsWith('/')) {
          localPath = localPath.substring(1);
        }
        
        const absolutePath = path.join(__dirname, localPath);
        
        if (fs.existsSync(absolutePath)) {
          try {
            console.log(`Uploading ${localPath} for ${ut.table} ID ${item.id}...`);
            const result = await cloudinary.uploader.upload(absolutePath, { folder: ut.folder });
            
            await db.promise().query(`UPDATE ${ut.table} SET image = ? WHERE id = ?`, [result.secure_url, item.id]);
            console.log(`Updated ${ut.table} ID ${item.id} with Cloudinary URL.`);
          } catch (uploadErr) {
            console.error(`Failed to upload ${localPath}:`, uploadErr.message);
          }
        } else {
          console.warn(`File not found: ${absolutePath}`);
        }
      }
    } catch (err) {
      console.error(`Error migrating ${ut.table} images:`, err.message);
    }
  }

  console.log("Migration finished.");
  process.exit(0);
}

migrateImages();
