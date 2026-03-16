# Oscar Nominations Checklist

## Live!

[Oscar Nominations Checklist](https://oscars.prerak.net/)

## Set-up

1. Clone this repository
2. `cd oscar-checklist`
3. _Optional Step to work with the development backend_: Change the `API_URL` in `src/App.tsx` to `http://localhost:8787`
4. Run `npm install`
5. Run `npm run dev`
6. Open [localhost:5173](http://localhost:5173/) in your browser

> [!WARNING]
> This project uses npm instead of bun because the Cloudflare Pages build environment does not support bun.

## About

This is a simple checklist app that allows users to check off movies they have seen that were nominated for an Oscar. Your watched movies are saved in local storage, so you can come back to the site and see what you have left to watch.

## Tests

1. Install dependencies: `npm install`
2. Install Playwright browsers (one-time): `npx playwright install`
3. Run the end-to-end suite: `npm run test:e2e`
4. View the HTML report: `npx playwright show-report`
