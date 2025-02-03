# LonStoreNx

## Overview

This project is a shopping cart application built using an NX monorepo architecture. It includes a Next.js frontend, an Express.js middleware, and reusable Storybook components. The project is fully tested with E2E and unit tests to ensure reliability.

## Tech Stack

NX Monorepo – Modular codebase management

Next.js – Frontend application

Express.js – Middleware for API handling

Storybook – Component-driven UI development

Jest & Cypress – Unit and E2E testing


## Project Structure
```bash
apps/
  lon-store/             # Next.js frontend
  lon-store-middleware/  # Express.js middleware
libs/
  lon-store-components/  # Storybook components

e2e/                     # End-to-end tests
```

## Installation
1. Clone the repository:
```bash
git clone git@github.com:lonzsuyi/lon-store-nx.git
cd lon-store-nx
```
2. Install dependencies:
```bash

```
3. Run tasks

To run the dev server for your app, use:

```sh
npx nx dev lon-store
```

To create a production bundle:

```sh
npx nx build lon-store
```

To see all available targets to run for a project, run:

```sh
npx nx show project lon-store
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

 