# IS4301 Assignment – NUS React App (Questions 5–7)

A React single-page app with:

- **Home** – NUS logo and the text “NUS is a leading research university in Asia”
- **Academics** – table of modules taught at the university
- **Admission** – admission process flow
- **Login / Sign up** – Firebase Authentication with email/password or Google account,
  with a shared credential-error notification for wrong passwords and absent accounts,
  preserving account privacy; other errors have actionable messages
- Academics and Admission are only accessible after logging in

## Run locally

```bash
npm install
npm start          # http://localhost:3000
npm test -- --watchAll=false
npm run build
```

Firebase settings are reused from the IS4301 tutorial project (`src/firebase-public-config.json`).
They can be overridden with `REACT_APP_FIREBASE_*` variables in a local `.env` file.

## Branches and CI

- `main` – released code; `develop` – integration branch for Exercises 6 and 7
- `.github/workflows/build.yml` runs `npm ci`, the unit tests and `npm run build`
  on every push, so build errors are caught automatically.
