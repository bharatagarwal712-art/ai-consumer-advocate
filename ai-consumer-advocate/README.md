# AI Consumer Advocate

## Setup

```bash
npm install
```

Create `.env.local`

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

Run locally:

```bash
npm run dev
```

Deploy:
- Push to GitHub
- Import into Vercel
- Add environment variables
- Deploy