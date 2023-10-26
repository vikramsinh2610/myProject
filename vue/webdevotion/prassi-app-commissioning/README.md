# TCW App - Commissioning

A comprehensive 🐨 App, based on Quasar.

## IMPORTANT NOTES

now upgraded to QUASAR 17.12

## Continuos Integration

 [![CircleCI](https://circleci.com/gh/EleverSrl/tcw-app-commissioning/tree/master.svg?style=shield&circle-token=37ddbd4bfd3ae44ffcc419e63d5604865fdbdfe0)](https://circleci.com/gh/EleverSrl/tcw-app-commissioning/tree/master)

## Prerequisities

![NodeJS](https://img.shields.io/badge/Node-%3E%3D%208.10.0%20LTS-brightgreen.svg)
![Yarn](https://img.shields.io/badge/yarn-1.7.0-blue.svg)

To see available scripts try autocomplete for `yarn`.

## Development

to start development type:

`yarn install`

and then:

`yarn dev`

### Philosphy

Single components are built generally data agnostics: they receive props and optionally have a v-model and/or emit an event with data.
This is to maximize reuse between components.

Data flow is done at the PAGES level.

Data is read from the specific store module, via computed items mapped to Vuex store.
Data then is given back to the store through specific mutations / async actions
Where possible v-model two-ways binding is to avoid.
Prefer getting data via props objects from Vuex store (:data="data") and doing modications via emitters (@changed="setChangedData"), that will commit data via mutations.

Always mutate state objects via spread operators so changes are propagated.
example:

object mutation:
```
state.filter = {
  time: { ...state.filter.time, selected: 'year', year },
  type: { ...state.filter.type },
};
```

array mutation:
```
state.direct.items = [...state.direct.items, ...proposals.items];
```

### Style guide

Style guide is an extension of [AirBnb Base](https://airbnb.io/projects/javascript/) with some extension plugin, like Jest, as you can see in `eslintrc.js` file.

Project supports [Prettier](https://github.com/prettier/prettier) to enable **automatic linting** on file save.

### Naming conventions

Custom components are named with a Prassi prefix, a specific name in the middle, and a type of component suffix. Filenames are lowercase, and component name is camelcase. HTML Elementname is lowercase separated with dashes.

Example:

filename: prassi-date-range-block.vue
component name: PrassiDateRangeBlock
html element: prassi-date-range-block

component types expresses the type and purpose of a component, and are:
block -> an organized rectangled, indipendent, self-containing, grouping of elements
hierarchy -> a component at the top of a list or of a tree
leaf -> the detail/final component in a list or a tree
row -> a row of organized data
filter -> a group of component that define a filter as an output

Custom CSS classes are named with a 'p' prefix and an acronym of component name a pre-suffix.

Example:

Component PrassiDateRangeBlock

css class p-dr-main-div

### Type checking

Type checking is provided by TypeScript type checking. If you don't know what does it mean, take a look at [here](https://github.com/Microsoft/TypeScript/wiki/Type-Checking-JavaScript-Files) and [here](https://github.com/Microsoft/TypeScript/wiki/JsDoc-support-in-JavaScript).

### Testing

Tests are inside `tests` folder with a `spec` suffix.

To launch tests via CLI there are `yarn test`.

Before launching test you have to configure babel via `yarn babeltest`.

Then babel should be reverted to prod via `yarn babelprod`.

Remember also to lint the code via `yarn lint`.

### Dependencies

Keep dependencies under control via `yarn upgrade-interactive`.

### QA

Before committing ensure everything is fine via `yarn lint && yarn test`.

### GIT workflow

This project follow [Elever Workflow Manifesto](https://github.com/EleverSrl/workflow#elever-development-workflow).

Style guide is enforced by [DangerJS](https://danger.systems) in PR stage.

### SemVer

This project follow [SemVer](https://semver.org/).

### RELEASE

tag release with

gulp bump --type prerelease | patch | minor | major

git push

PR && merge branch to master (an admin maybe required)

create release tag in github to deploy (an admin maybe required)

### GIT workflow

This project follow [Elever Workflow Manifesto](https://github.com/EleverSrl/workflow#elever-development-workflow).

