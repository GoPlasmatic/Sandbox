# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Sandbox** repository with a Docusaurus-based documentation website. It is licensed under **Apache License 2.0**.

## Project Structure

```
/
├── website/              # Docusaurus documentation site
│   ├── blog/            # Blog posts
│   ├── docs/            # Documentation pages
│   ├── src/             # React components and custom pages
│   ├── static/          # Static assets
│   └── docusaurus.config.ts  # Site configuration
└── CLAUDE.md            # This file
```

## Common Development Commands

### Docusaurus Website Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve

# Clear cache
npm run clear

# Deploy to GitHub Pages
npm run deploy

# Type checking
npm run typecheck

# Create a new documentation version
npm run docusaurus docs:version VERSION_NUMBER
```

## Development Workflow

1. Navigate to the website directory: `cd website`
2. Install dependencies if needed: `npm install`
3. Start development server: `npm start`
4. Make changes and preview at http://localhost:3000
5. Build before deploying: `npm run build`

## Documentation Guidelines

- Documentation files are in Markdown format in `website/docs/`
- Blog posts go in `website/blog/` with naming format: `YYYY-MM-DD-slug.md`
- Use MDX for interactive components
- Follow existing frontmatter structure for consistency

## Git Workflow

- Main branch: `main`
- Repository uses standard git workflow
- Apache 2.0 license applies to all contributions
