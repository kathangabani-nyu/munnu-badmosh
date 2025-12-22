# Building the Static Site

## Quick Build Instructions

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the static site**:
   ```bash
   npm run build
   ```

   This will create an `out` folder with all static files ready for deployment.

3. **Test locally** (optional):
   ```bash
   npx serve out
   ```

## Deployment Options

### Option 1: Vercel (Recommended - Free)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository: `kathangabani-nyu/munnu-badmosh`
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Generate QR Code**:
   - Use any QR generator (qr-code-generator.com, etc.)
   - Point it to: `https://your-site.vercel.app`

### Option 2: Netlify (Free Alternative)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import from Git → Select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Deploy!

### Option 3: Manual Deployment

1. Build the site: `npm run build`
2. Upload the `out` folder to any static hosting service
3. Your site is ready!

## Notes

- The site is configured for static export (no server needed)
- All media files are in `/public/media/`
- The site is optimized for mobile (iPhone 15 Pro tested)
- No analytics or tracking included (privacy-first)

