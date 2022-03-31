# Using Github Actions

You can create a file named `master.yml` under `.github/workflows/` to start using Github Actions. 

Secrets are stored in the repository settings. 

You can also create multiple `yml` files that deploy to different stores, so you can use them for `stage` or `develop` branches. 

```yml 
# This is a basic workflow to help you get started with Actions

name: "Deploy to Shopify"

# Controls when the action will run. 
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ master ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - name: Shopify
        uses: ./.github/actions/shopify
        env:
          SHOPIFY_PASSWORD: ${{ secrets.SHOPIFY_PASSWORD }}
          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}
          SHOPIFY_THEME_ID: ${{ secrets.SHOPIFY_THEME_ID }}
          THEME_PATH: ./theme/
        with:
          args: --ignored-file=config/settings_data.json --allow-live

```
