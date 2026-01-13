# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Sandbox repository with an mdbook-based documentation website for the Reframe API. Licensed under Apache License 2.0.

## Project Structure

```
/
├── docs/                 # mdbook documentation site
│   ├── book.toml        # mdbook configuration
│   ├── src/             # Documentation source files
│   │   ├── SUMMARY.md   # Navigation structure
│   │   ├── introduction.md
│   │   ├── playground.md
│   │   ├── getting-started/
│   │   ├── sample-generation/
│   │   ├── validation/
│   │   ├── transformation/
│   │   ├── reference/
│   │   ├── img/         # Logo and images
│   │   └── data/        # Scenario data (JSON)
│   └── theme/           # Custom JS/CSS
│       ├── reframe-playground.js
│       └── reframe-playground.css
└── CLAUDE.md            # This file
```

## Common Development Commands

### mdbook Documentation (from `/docs` directory)

```bash
# Install mdbook (if not installed)
cargo install mdbook

# Start development server (http://localhost:3000)
mdbook serve

# Build for production
mdbook build

# Clean build output
rm -rf book/
```

## Development Workflow

1. Navigate to the docs directory: `cd docs`
2. Start development server: `mdbook serve`
3. Make changes and preview at http://localhost:3000
4. Build before deploying: `mdbook build`

## Documentation Guidelines

- Documentation files are in Markdown format in `docs/src/`
- Navigation is defined in `docs/src/SUMMARY.md`
- Interactive API widgets use `<div class="reframe-widget" data-type="..." data-format="..."></div>`
- Custom styling and JS in `docs/theme/`

## Git Workflow

- Main branch: `main`
- Repository uses standard git workflow
- Apache 2.0 license applies to all contributions

## Deployment

Build the static site with:
```bash
cd docs
mdbook build
# Output is in docs/book/
```
