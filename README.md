# Lothus Boilerplate

```sh
├── /_site/                       # Production directory (minified, optimized and compiled files)
├── /src/                         # source folder
  └── /app/                       # Javascript source
  └── /fonts/                     # Fonts folder
  └── /styles/                    # SCSS styles
  └── /views/                     # Pug templates, Prismic Data
├── .env                          # Environment variables
├── .gitignore                    # Tells git which files to ignore
├── package.json                  # Project meta and dependencies
├── eleventy.js                   # Eleventy + Vite's configuration file
```

# Node

The build should work with any recent version of Node.
It's recommended to use node v17.5 through NVM

```sh
nvm install 18.7.1
```

# Install the dependencies

```sh
pnpm i
```

# Run dev environment

```sh
pnpm run dev
```

# How to run the static version

```sh
pnpm run build
```

## .env

```sh
VITE_PRISMIC_ACCESS_TOKEN=
PRISMIC_CLIENT_ID=
PRISMIC_CLIENT_SECRET=
VITE_PRISMIC_ENDPOINT=https://<something>.prismic.io/api/v2

GOOGLE_ANALYTICS=GOOGLE_ANALYTICS
```
