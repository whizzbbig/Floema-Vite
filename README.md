# Lothus Boilerplate

```sh
├── /dist/                        # Production directory (minified, optimized and compiled files)
├── /src/                         # source folder
  └── /app/                       # Javascript source
  └── /pages/                     # Pages entry points including Vite's index.html
  └── /data/                      # Service to get data form APIs, i.: Prismic
  └── /styles/                    # SCSS styles
  └── /views/                     # Handlebar templates
├── .env                          # Environment variables
├── .gitignore                    # Tells git which files to ignore
├── package.json                  # Project meta and dependencies
├── vite.config.js                # Vite's configuration file
```

# Node
The build should work with any recent version of Node.
It's recommended to use node v17.5 through NVM
```sh
nvm install 17.5
```

# Install the dependencies
```sh
yarn
```

# Run dev environment
```sh
yard run dev
```

# How to run the static version
```sh
yarn run build
yarn run preview
```

## .env

```sh
VITE_PRISMIC_ACCESS_TOKEN=
PRISMIC_CLIENT_ID=
PRISMIC_CLIENT_SECRET=
VITE_PRISMIC_ENDPOINT=https://<something>.prismic.io/api/v2

GOOGLE_ANALYTICS=GOOGLE_ANALYTICS
```
