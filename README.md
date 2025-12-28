# Astro Starter Template

Minimal, blank starting point for new Astro projects with the following preconfigured:

- ESLint
- Prettier (with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`)
- Tailwind CSS (v4)

Use it as a GitHub template to spin up new repos quickly. This repository is a private template: [itzMaffi/astro-starter](https://github.com/itzMaffi/astro-starter).

## Use this template on GitHub

1. Open the template on GitHub: [itzMaffi/astro-starter](https://github.com/itzMaffi/astro-starter), then click **Use this template** → **Create a new repository**.
2. Choose a repository name, select **Private** visibility, and create the repo.
3. Clone your new repo and install dependencies:

   ```sh
   git clone <your-repo-url>
   cd <your-repo-folder>
   pnpm install
   ```

4. Start developing:

   ```sh
   pnpm dev
   ```

   The dev server runs at `http://localhost:4321`.

Alternatively (GitHub CLI):

```sh
# Create a new PRIVATE repo from the template and clone it
gh repo create itzMaffi/<new-repo-name> --private --template itzMaffi/astro-starter --clone

cd <new-repo-name>
pnpm install
pnpm dev
```

## Scripts

All commands run from the project root:

| Command          | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| `pnpm install`   | Install dependencies                                      |
| `pnpm dev`       | Start the dev server at `http://localhost:4321`           |
| `pnpm build`     | Build the production site to `./dist/`                    |
| `pnpm preview`   | Preview the production build locally                      |
| `pnpm astro ...` | Run Astro CLI commands (e.g., `astro add`, `astro check`) |

## Tech

- Astro 5
- Tailwind CSS 4
- ESLint 9, Prettier 3
