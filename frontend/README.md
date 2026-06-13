# Amazon Now Frontend

React Native / Expo frontend for the Amazon Now quick-commerce prototype.

## Project Structure

```text
frontend/
  App.js
  src/
    components/
      catalog/       Product cards, shelves, category grids
      common/        Shared screen chrome
      home/          Home-page specific sections
      layout/        Phone shell and app container
      navigation/    Bottom navigation
    data/            Dummy product and category catalog
    scripts/         Excel-to-JSON catalog import
    screens/         App pages
    theme/           Shared colors and shadows
```

## Product Dataset

The source product catalog is:

```text
data/source/AmazonNow_Dummy_Product_Dataset.xlsx
```

The app loads the generated `src/data/products.json` catalog. After changing the
Excel workbook, regenerate the JSON with:

```bash
python scripts/import_excel_products.py
```

## Run

```bash
npm install
npm run web
```

Use `npm.cmd run web` on Windows if PowerShell blocks `npm.ps1`.
