# Manga Hub

A Vite + React reader experience that keeps every series and chapter inside the app so visitors never have to bounce out to an external site.

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server with a shareable host/port so others (or a tunneling tool) can hit it
   ```bash
   npm run dev -- --host 0.0.0.0 --port 4173
   ```
3. Open [http://localhost:4173](http://localhost:4173) (or whatever tunnel URL you expose) to interact with the UI.

## Production-like preview
When you want to share a build that behaves like production, use Vite's preview server. The `--host` and `--port` flags mirror the dev instructions above so the preview can be proxied or exposed the same way:
```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## Tests
Run the Vitest suite to make sure adapters, UI, and storage helpers continue to work:
```bash
npm test
```
