# Amazon Now

Amazon Now is a React Native quick-commerce prototype. The application source lives in
the `frontend` folder.

## Run

```bash
npm install
npm run web
```

The root `package.json` forwards commands into `frontend`, so you can run the app
from `HackOn` directly. If dependencies are missing inside `frontend`, run:

```bash
npm run install:frontend
```

The current milestone focuses on the polished mobile shopping foundation:

- Splash logo screen
- Mobile phone frame for browser demos
- Quick-commerce home page inspired by Blinkit/Amazon quick delivery
- Search bar, category tabs, grocery sections, product shelves
- Category listing page
- Product detail page
- Cart page
- Structured React Native source under `frontend/src`
