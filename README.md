# InnoLink – Linking Innovation with Opportunity

InnoLink is a community-driven innovation platform connecting problem solvers, ideators, and investors.

## Features

- **Post Ideas & Solutions**: Share your concepts or prototypes.
- **Problem Discovery**: Find problems posted by users or hackathon organizers.
- **Smart Search**: Semantic similarity checks (simulated) to prevent duplicate ideas.
- **Role-Based Access**: Designed for Users, Investors, and Admins.
- **Interactive Community**: Tag problems, link solutions, and create polls.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Locally**
   ```bash
   npm run dev
   ```

## Customization

- **Colors**: The design system uses CSS variables in `src/index.css`. Update `--color-primary` and `--color-accent` to match your specific logo branding if needed.
- **Logo**: The header logo is currently CSS-styled. Replace the icon in `src/components/Header.jsx` with an `<img>` tag pointing to your logo file if preferred.

## Project Structure

- `src/pages/PostPage.jsx`: Logic for posting problems/ideas with duplicate checks.
- `src/pages/SearchIdeas.jsx`: Idea discovery with AI summarization mock.
- `src/pages/SearchProblems.jsx`: Problem finder with category filters and keyword analysis.
- `src/components/Header.jsx`: Navigation and Branding.
