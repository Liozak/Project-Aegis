# Contributing to Project Aegis

Thanks for your interest! Here's how to get started:

## Setup
1. Fork the repo and clone it locally
2. Run `npm install`
3. Create a `.env` file and add your Gemini API key as `VITE_GEMINI_API_KEY`
4. Run `npm run dev` to start the dev server

## Making Changes
- Create a new branch: `git checkout -b feature/your-feature-name`
- Make your changes and commit with clear messages
- Push and open a Pull Request against `main`

## Code Style
- Use TypeScript strictly — no `any` types
- Keep components under 100 lines where possible
- Run `npm run build` before submitting to ensure no type errors

## Reporting Bugs
Open an issue and include the media type, browser, and steps to reproduce.
