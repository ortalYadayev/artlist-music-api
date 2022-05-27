# API

## Required software

1. MySQL for local environment

## Installation

1. Configure your environment variables: `cp .env.example .env`

## Getting Started

1. Install the project dependencies by running `npm run install` from the project's directory (using a terminal)
2. Run the project by running `npm run serve`

## Syncing migrations

When you create a new entity or change an existing entity, you should generate a migration file: `yarn migration:generate --name <migration_name>`

