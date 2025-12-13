# Cache Headers Configuration

This project includes a `public/_headers` file that defines cache strategies for static assets.

## Platform Support

- **Cloudflare Pages**: Automatically uses `_headers` file
- **Netlify**: Automatically uses `_headers` file  
- **GitHub Pages**: Does NOT support `_headers` natively

## For GitHub Pages

If deploying to GitHub Pages, you have a few options:

1. **Use a CDN/Proxy** (Recommended):
   - Cloudflare (free tier available)
   - Set up a proxy in front of GitHub Pages
   - Configure cache headers via Cloudflare dashboard

2. **Manual Configuration**:
   - Use GitHub Actions to set headers (requires custom workflow)
   - Or accept default GitHub Pages caching (limited control)

3. **Alternative Hosting**:
   - Consider Cloudflare Pages or Netlify for better cache control

## Current Cache Strategy

- **Static assets** (`/assets/*`): 1 year, immutable
- **Images** (`.png`, `.jpg`, `.svg`, `.ico`): 1 year, immutable
- **HTML**: 1 hour, must-revalidate
- **JSON/XML**: 1 day
- **Root SPA**: No cache (always fresh)

This strategy balances performance (long cache for assets) with freshness (short cache for HTML).

