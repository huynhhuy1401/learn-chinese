import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { createPrismaClient } from './seed-client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = createPrismaClient();

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const images: Record<string, string> = {
  Beijing: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=400&fit=crop',
  Shaanxi: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=400&fit=crop',
  Sichuan: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop',
  Shanghai: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&h=400&fit=crop',
  Yunnan: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=400&fit=crop',
  Guangdong: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=400&fit=crop',
  Henan: 'https://images.unsplash.com/photo-1544383837-bd2a91b3beb5?w=800&h=400&fit=crop',
  Xinjiang: 'https://images.unsplash.com/photo-1516703710214-04570f4e7a8e?w=800&h=400&fit=crop',
  'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9fa95d87a18e?w=800&h=400&fit=crop',
};

async function main() {
  // 1. Create bucket if not exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === 'lesson-images')) {
    const { error } = await supabase.storage.createBucket('lesson-images', { public: true });
    if (error) {
      console.error('Failed to create bucket:', error.message);
      // Continue anyway - bucket might exist
    } else {
      console.log('✅ Created bucket: lesson-images');
    }
  } else {
    console.log('📦 Bucket already exists');
  }

  // 2. Download & upload each image
  for (const [name, unsplashUrl] of Object.entries(images)) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const fileName = `${slug}.jpg`;
    const tmpPath = `/tmp/${fileName}`;

    // Download from Unsplash
    console.log(`⬇️  Downloading ${name}...`);
    const response = await fetch(unsplashUrl);
    if (!response.ok) {
      console.error(`  Failed to download ${name}: ${response.status}`);
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(tmpPath, buffer);

    // Upload to Supabase
    console.log(`⬆️  Uploading ${name} to Supabase...`);
    const fileData = fs.readFileSync(tmpPath);
    const { error: uploadError } = await supabase.storage
      .from('lesson-images')
      .upload(fileName, fileData, { upsert: true, contentType: 'image/jpeg' });

    if (uploadError) {
      console.error(`  Upload error for ${name}:`, uploadError.message);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('lesson-images').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Update database
    await prisma.province.updateMany({
      where: { name },
      data: { imageUrl: publicUrl },
    });

    console.log(`  ✅ ${name}: ${publicUrl}`);
    fs.unlinkSync(tmpPath);
  }

  console.log('\n🎉 All images uploaded to Supabase Storage!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
