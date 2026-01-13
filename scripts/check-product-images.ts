import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env file manually
const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^VITE_SUPABASE_URL=(.+)$/);
    if (match) supabaseUrl = match[1].trim();
    
    const keyMatch = line.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/);
    if (keyMatch) supabaseKey = keyMatch[1].trim();
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductImages() {
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (productsError) throw productsError;

    console.log('\n=== Product Images Report ===\n');

    for (const product of products || []) {
      console.log(`\n📦 Product: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Thumbnail: ${product.thumbnail_url}`);

      // Get detail images
      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('sort_order', { ascending: true });

      if (imagesError) {
        console.log(`   ❌ Error fetching images: ${imagesError.message}`);
      } else if (!images || images.length === 0) {
        console.log(`   ⚠️  No detail images found`);
      } else {
        console.log(`   ✅ Detail images (${images.length}):`);
        images.forEach((img, idx) => {
          console.log(`      ${idx + 1}. ${img.image_url}`);
        });

        // Check if thumbnail is same as detail images
        const hasDuplicateThumbnail = images.some(img => img.image_url === product.thumbnail_url);
        if (hasDuplicateThumbnail) {
          console.log(`   ⚠️  WARNING: Thumbnail is duplicated in detail images!`);
        }
      }
    }

    console.log('\n=== End of Report ===\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProductImages();
