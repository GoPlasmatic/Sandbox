# Interactive Playground

Test Reframe transformations, validation, and sample generation directly in your browser.

## Full Playground

The complete playground with all features:

<div id="reframe-playground"></div>

## Features

### Generate Tab
Create sample SWIFT MT or ISO 20022 messages for testing.

### Validate Tab
Validate any message and see detailed error reports.

### Transform Tab
Convert messages between MT and ISO 20022 formats.

## Configuration

### API URL

By default, the playground connects to `https://reframeapi.goplasmatic.io`. To use a local instance:

1. Click the **Settings** icon in the playground
2. Enter your local API URL (e.g., `http://localhost:3000`)
3. Click **Save**

Your preference is stored in browser local storage.

### Running Locally

Start Reframe locally:

```bash
docker run -p 3000:3000 ghcr.io/goplasmatic/reframe:latest
```

Then configure the playground to use `http://localhost:3000`.

## Individual Widgets

For focused testing, use the individual playground pages:

- **[Generator](./generator.md)** - Generate sample messages
- **[Validator](./validator.md)** - Validate messages
- **[Transformer](./transformer.md)** - Transform between formats

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Execute current operation |
| `Ctrl/Cmd + L` | Clear output |
| `Ctrl/Cmd + K` | Copy output to clipboard |

## Tips

### Testing Transformations

1. **Generate** a sample message
2. **Copy** the output
3. Switch to **Transform** tab
4. **Paste** and transform
5. **Validate** the result

### Debugging Issues

Enable **Debug Mode** in the transformer to see:
- Each workflow that executed
- Intermediate values
- Field mapping results

### API Integration

Each operation shows the **API Request & Response** panel. Use this to:
- Copy curl commands for your scripts
- See exact request format
- Debug API integration issues

---

**[Generator Playground →](./generator.md)**

**[Validator Playground →](./validator.md)**

**[Transformer Playground →](./transformer.md)**
