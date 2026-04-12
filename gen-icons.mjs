import Jimp from 'jimp';

async function make(size, path) {
  const img = new Jimp({ width: size, height: size, color: 0x0f172aff });
  // green rounded square area (approx)
  const pad = Math.floor(size * 0.1);
  for (let y = pad; y < size - pad; y++) {
    for (let x = pad; x < size - pad; x++) {
      img.setPixelColor(0x22c55eff, x, y);
    }
  }
  // white dumbbell shape (simple bars)
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  const bh = Math.floor(size * 0.12);
  const bw = Math.floor(size * 0.55);
  for (let y = cy - Math.floor(bh/2); y < cy + Math.floor(bh/2); y++) {
    for (let x = cx - Math.floor(bw/2); x < cx + Math.floor(bw/2); x++) {
      img.setPixelColor(0xffffffff, x, y);
    }
  }
  // end weights
  const ww = Math.floor(size * 0.12);
  const wh = Math.floor(size * 0.35);
  for (const xOff of [cx - Math.floor(bw/2) - ww, cx + Math.floor(bw/2)]) {
    for (let y = cy - Math.floor(wh/2); y < cy + Math.floor(wh/2); y++) {
      for (let x = xOff; x < xOff + ww; x++) {
        img.setPixelColor(0xffffffff, x, y);
      }
    }
  }
  await img.write(path);
  console.log('wrote', path);
}

await make(192, 'public/icon-192.png');
await make(512, 'public/icon-512.png');
