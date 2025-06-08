# Integro

Integro is a simple integration bus framework built on top of Express. The application dynamically loads modules from the `modules` directory and exposes their HTTP handlers and methods.

## Setup

1. Install Node.js **20**.
2. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and adjust values if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### Environment variables

The application is configured through the following variables defined in `.env`:

| Name          | Description                                                         | Default  |
|---------------|---------------------------------------------------------------------|----------|
| `PORT`        | Port where the HTTP server will listen.                             | `4444`   |
| `UPLOAD_LIMIT`| Maximum request body size accepted by `body-parser`.                | `1024kb` |
| `VIEW_ENGINE` | Template engine used by Express for rendering views.                | `ejs`    |
| `RELOAD_TOKEN`| If set, requests containing `reload=<token>` trigger module reload. | —        |

## Module structure

Each module lives inside the `modules/` directory and typically contains the following files:

- `index.js` – HTTP request handler
- `methods.js` – exported methods that can be called internally
- `subscriptions.js` – event handlers subscribed to specific events
- `main.js` – optional file implementing the module logic

Modules are loaded automatically; simply create a new folder under `modules/` containing these files.

## package-lock.json

The `package-lock.json` file is deliberately ignored in `.gitignore` so that every installation resolves the latest compatible versions of dependencies. This project currently does not commit the lockfile.

