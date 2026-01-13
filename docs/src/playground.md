# Interactive Playground

Test Reframe's API directly from your browser. Generate sample messages, validate them, and transform between SWIFT MT and ISO 20022 formats.

<div id="reframe-playground"></div>

## How to Use

1. **Select an operation**: Choose between Generate, Validate, or Transform
2. **Configure options**: Select message type, format, or scenario
3. **Enter your message**: Paste or type your message (or generate a sample)
4. **Execute**: Click the action button to process your request
5. **Review results**: See the response, errors, or transformed output

## Direct Links

Link directly to a specific tab using URL hash:

- [Generate Tab](./playground.md#generate) - `#generate`
- [Validate Tab](./playground.md#validate) - `#validate`
- [Transform Tab](./playground.md#transform) - `#transform`

## API Endpoints

The playground uses these Reframe API endpoints:

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| Generate | `POST /api/generate` | Generate sample messages |
| Validate | `POST /api/validate` | Validate MT or MX messages |
| Transform | `POST /api/transform` | Transform between formats |

## Running Locally

To use the playground with a local Reframe instance:

```bash
# Start Reframe
docker run -p 3000:3000 ghcr.io/goplasmatic/reframe:latest

# Update the API URL in the playground to http://localhost:3000
```
