# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Justin Nguyen, built with vanilla HTML/CSS/JavaScript and deployed on Netlify with serverless functions.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Backend**: Netlify Functions (serverless)
- **API Integration**: OpenAI API for MTG card generation
- **Deployment**: Netlify (static hosting + serverless functions)

## Project Structure

```
/
├── index.html                    # Main portfolio page
├── script.js                     # Main site functionality (dark mode, navigation)
├── styles.css                    # Main site styles
├── mtg/                         # MTG Card Generator project
│   ├── index.html
│   ├── mtg-script.js            # OpenAI API integration
│   └── mtg-styles.css
├── particle-life/               # Particle Life simulation project
│   ├── index.html
│   ├── particle-life-script.js  # Simulation logic
│   └── particle-life-styles.css
└── netlify/functions/           # Serverless functions
    └── generate-mtg-card.js     # OpenAI API endpoint
```

## Common Commands

Since this is a static site with no build process:

```bash
# No build/test/lint commands - this is a static site
# To run locally, use any static server:
python -m http.server 8000
# or
npx serve .
```

For serverless function development:
```bash
# Install dependencies (only needed for serverless functions)
npm install

# Test serverless functions locally (requires Netlify CLI)
netlify dev
```

## Architecture Notes

### Frontend Architecture
- **No build step**: Files are served directly, no bundling or transpilation
- **Dark mode**: Implemented via localStorage and CSS variables in script.js
- **Project routing**: Each project has its own subdirectory with independent HTML/CSS/JS

### Serverless Functions
- **Location**: netlify/functions/generate-mtg-card.js
- **Environment variables**: OPENAI_API_KEY must be set in Netlify dashboard
- **CORS**: Already configured for justinnguyen.ai domain

### Key Implementation Details

1. **Dark Mode Toggle**: Managed in script.js using localStorage for persistence
2. **MTG Card Generator**: Makes API calls to /api/generate-mtg-card endpoint which proxies to OpenAI
3. **Particle Life Simulation**: Self-contained canvas-based simulation with audio integration
4. **Responsive Design**: CSS Grid and Flexbox used throughout, no CSS framework

## Development Guidelines

- Keep vanilla JavaScript approach - no frameworks unless specifically requested
- Maintain file separation (HTML, CSS, JS in separate files)
- Test serverless functions with actual Netlify environment variables
- Preserve existing responsive design patterns when adding new features
- Any new API integrations should use Netlify Functions for security