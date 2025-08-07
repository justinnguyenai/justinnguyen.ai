# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Justin Nguyen, built with vanilla HTML/CSS/JavaScript and deployed on Netlify with serverless functions. The codebase has been extensively refactored for maximum readability, maintainability, and beginner-friendliness.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Backend**: Netlify Functions (serverless)
- **API Integration**: OpenAI API for Magic card generation
- **Deployment**: Netlify (static hosting + serverless functions)

## Project Structure

```
/
├── index.html                    # Main portfolio page (self-contained)
├── projects.html                 # Dedicated projects showcase page (self-contained)
├── magic-card-generator.html     # MTG Card Generator project (self-contained)
├── particle-life.html           # Particle Life simulation project (self-contained)
├── assets/                      # All static assets
│   ├── favicon.png
│   ├── profile-picture.jpg
│   ├── kalshi.jpg               # Project images
│   ├── magic-card-generator.jpg
│   ├── particle-life.gif
│   ├── tetris.gif
│   ├── snake.gif
│   ├── flappy-bird.gif
│   └── river.mp3                # Audio file for particle life
├── netlify.toml                 # Netlify deployment configuration
├── package.json                 # Node.js dependencies for serverless functions
└── netlify/functions/
    └── generate-magic-card.js   # OpenAI API endpoint
```

## Architecture Philosophy

**Self-Contained Files**: Each HTML file contains all its CSS and JavaScript embedded with extensive comments (700+ lines of documentation per file). This approach:
- Eliminates file separation complexity
- Makes each project completely independent
- Provides comprehensive inline documentation
- Enables beginners to understand everything in one place

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

## Code Quality Standards

### Documentation
- **Extensive comments**: Every section, function, and style rule is documented
- **Beginner-friendly**: Comments explain HTML/CSS/JavaScript concepts
- **Code organization**: Clear section headers and logical grouping

### Naming Conventions
- **Descriptive names**: `magic-card-generator.html` instead of `mtg.html`
- **Consistent kebab-case**: All multi-word files use hyphens
- **No acronyms**: Full descriptive names for clarity
- **No version numbers**: Clean filenames without version suffixes

### Visual Consistency
- **Standardized buttons**: Consistent padding (0.5rem 1rem), font-size (1rem), colors
- **Uniform spacing**: Consistent margins, padding, and border-radius (4px)
- **Color scheme**: Professional purple theme (#7c3aed) with proper dark mode support
- **Typography**: Roboto font family throughout (except intentional monospace)

## Key Implementation Details

1. **Dark Mode Toggle**: Managed via localStorage with consistent behavior across all pages
2. **Projects Page**: Dedicated showcase of portfolio projects with visual consistency
3. **Magic Card Generator**: Makes API calls to `/api/generate-magic-card` endpoint
4. **Particle Life Simulation**: Complex physics simulation with descriptive variable names
5. **Responsive Design**: Mobile-first approach with consistent breakpoints
6. **Asset Management**: Single `assets/` folder for all static files

## Development Guidelines

### Code Style
- **No frameworks**: Keep vanilla JavaScript approach
- **Self-contained files**: Embed CSS/JS in HTML files
- **Extensive comments**: Document every section and function
- **Descriptive naming**: Use full descriptive names, avoid abbreviations
- **Consistent formatting**: Follow established patterns

### File Organization
- **Root level projects**: Keep HTML files at root for simplicity
- **Single assets folder**: All static files in `assets/` directory
- **Kebab-case naming**: Use hyphens for multi-word filenames
- **No version numbers**: Avoid version suffixes in filenames

### Performance Considerations
- **Typed arrays**: Use Float32Array/Int32Array for particle simulation
- **Efficient rendering**: RequestAnimationFrame for smooth animations
- **Image optimization**: Appropriate formats (PNG for icons, JPG for photos, GIF for animations)

### Testing
- Test serverless functions with actual Netlify environment variables
- Verify dark mode functionality across all pages
- Check responsive design on multiple screen sizes
- Validate all asset paths after any file reorganization

### Adding New Features
- Follow existing comment structure and density
- Use consistent naming conventions
- Maintain visual consistency with existing button/color schemes
- Add comprehensive inline documentation
- Test across all four pages for consistency

## Security Notes
- Never commit API keys or secrets to repository
- Use Netlify Functions for any server-side API calls
- CORS is configured for justinnguyen.ai domain
- Environment variables set in Netlify dashboard

## Accessibility
- Semantic HTML structure throughout
- Proper alt text for all images
- Keyboard navigation support where applicable
- Color contrast meets accessibility standards
- Screen reader friendly with proper headings hierarchy