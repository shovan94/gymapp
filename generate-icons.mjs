import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function makeIcon(size, outPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.roundRect(size*0.1, size*0.1, size*0.8, size*0.8, size*0.18);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${size*0.55}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏋️', size/2, size/2);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
}
makeIcon(192, 'public/icon-192.png');
makeIcon(512, 'public/icon-512.png');
console.log('Icons generated');
