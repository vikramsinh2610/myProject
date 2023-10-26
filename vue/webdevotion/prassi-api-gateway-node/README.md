# Prassi API Gateway

A fully featured and fast 🐨 API Gateway, based on Fastify.

[![CircleCI](https://circleci.com/gh/EleverSrl/tcw-api-gateway-node/tree/master.svg?style=shield&circle-token=ff967a8b179d1420dee6fa946e1208e0a936d623)](https://circleci.com/gh/EleverSrl/tcw-api-gateway-node/tree/master)

[![Waffle.io - Columns and their card count](https://badge.waffle.io/59baf9f308ac08da391eb313292db9d46a47bb5177ae263e8de7b5eca4b9663c.svg?columns=all)](https://waffle.io/EleverSrl/tcw-api-gateway-node)

## Prerequisities

![NodeJS](https://img.shields.io/badge/Node-%3E%3D%2010.0%20LTS-brightgreen.svg)
![Yarn](https://img.shields.io/badge/yarn-1.7.0-blue.svg)

To see available scripts try autocomplete for `yarn`.

## Development

### Style guide

Style guide is an extension of [AirBnb Base](https://airbnb.io/projects/javascript/) with some extension plugin, like Jest, as you can see in `eslintrc.js` file.

Project supports [Prettier](https://github.com/prettier/prettier) to enable **automatic linting** on file save.

### Type checking

Type checking is provided by TypeScript type checking. If you don't know what does it mean, take a look at [here](https://github.com/Microsoft/TypeScript/wiki/Type-Checking-JavaScript-Files) and [here](https://github.com/Microsoft/TypeScript/wiki/JsDoc-support-in-JavaScript).
There is also JSDoc typing.

### Testing

For BDD tests see `src/__tests__` folder while TDD tests are spread inside `src` with `.test.js` or `.spec.js` suffix.

VSCode Jest extension and code coverage gutters are useful while developing, see also `Debug Jest tests` configuration.

To launch tests via CLI there are `yarn test` for a single run, `yarn testing` for TDD and `yarn coverage` to open the HTML coverage report.

### Dependencies

Keep dependencies under control via `yarn deps-check` check and `yarn deps-update` action.

### QA

Before committing ensure everything is fine via `yarn qa`. This step is executed automatically on git pre-push.

### SemVer

This project follow [SemVer](https://semver.org/).

### Workflow

This project follow the [Git Elever Workflow Manifesto](https://github.com/EleverSrl/workflow#elever-development-workflow).

### Visual Studio Code

If you'd like to use Visual Studio Code, here some utils:

Extensions:

```json
{
  "recommendations": [
    "DavidAnson.vscode-markdownlint",
    "EditorConfig.EditorConfig",
    "Orta.vscode-jest",
    "andys8.jest-snippets",
    "christian-kohler.npm-intellisense",
    "christian-kohler.path-intellisense",
    "codezombiech.gitignore",
    "dbaeumer.vscode-eslint",
    "eg2.vscode-npm-script",
    "esbenp.prettier-vscode",
    "mgmcdermott.vscode-language-babel",
    "ryanluker.vscode-coverage-gutters"
  ]
}
```

Debug:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Start debugging",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "protocol": "inspector",
      "port": 9229,
      "address": "localhost",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "debug"]
    },
    {
      "name": "Debug Jest tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["--inspect-brk", "${workspaceRoot}/node_modules/.bin/jest", "--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach debugger",
      "protocol": "inspector",
      "processId": "${command:PickProcess}"
    }
  ]
}
```

Settings:

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wrappingIndent": "indent",
  "editor.trimAutoWhitespace": true,
  "editor.formatOnSave": true,

  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true
  },

  "search.exclude": {
    "**/node_modules": true
  },

  "javascript.format.enable": false,
  "javascript.validate.enable": true,

  "eslint.enable": true,
  "prettier.eslintIntegration": false,
  "prettier.printWidth": 120,

  "jest.autoEnable": true,
  "jest.enableInlineErrorMessages": true,
  "jest.enableSnapshotUpdateMessages": true,
  "jest.pathToJest": "node_modules/.bin/jest",

  "typescript.tsdk": "node_modules/typescript/lib"
}
```

A beautiful theme I suggest: `gerane.theme-brogrammer` with `Operator Mono` font.

## Deployment

Deployment is demanded to Circle CI, with these rules:

- Commits on _master_: qa & deploy to dev environment.
- Commits on _`FEAT-*`_ (that begins with...) branches: qa & deploy to dev environment.
- Commits on _all other_ branches: qa stage only.
- SemVer tag push on _master_: deploy to production environment.

### Setup

To setup first run, after wiping database, call `v1/services/indexing` and `v1/services/seed` APIs.

## Mail Templates

Mail templates are from [PostMark](https://github.com/wildbit/postmark-templates);

## API Documentation

API documentation is available [here](https://tcw-api-dev.prassi-app.com/doc) or in Swagger definition [here](https://tcw-api-dev.prassi-app.com/swagger).
