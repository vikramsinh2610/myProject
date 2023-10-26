module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: [
    'plugin:vue/strongly-recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'airbnb-base',
    'prettier',
    'eslint-config-prettier',
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier', 'unicorn', 'sonarjs'],
  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
  },
  // add your custom rules here
  rules: {
    "prettier/prettier": ["error",{
      "endOfLine": "auto"}
    ],
    'arrow-parens': [2, 'always'],
    'no-param-reassign': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-underscore-dangle': 'off',
    'func-names': ['error', 'never'],
    'sonarjs/no-duplicate-string': 0,
    'vue/custom-event-name-casing': 'off',
    'vue/component-definition-name-casing': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-array-some': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-push-push': 'off',
    'sonarjs/no-nested-template-literals': 'off',
    'unicorn/numeric-separators-style': 'off',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, minProperties: 9, consistent: true },
        ObjectPattern: { multiline: true, minProperties: 9, consistent: true },
        ImportDeclaration: { multiline: true, minProperties: 9, consistent: true },
        ExportDeclaration: { multiline: true, minProperties: 9, consistent: true },
      },
    ],
    'function-paren-newline': 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
      },
    ],
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 6,
        multiline: {
          max: 1,
          allowFirstLine: true,
        },
      },
    ],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: true,
      },
    ],
    'sonarjs/cognitive-complexity': ['error', 17],

    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          i: {
            index: false,
          },
          j: {
            index: false,
          },
          fn: {
            function_: false,
          },
          fnReturn: {
            functionReturn: false,
          },
          forEachAsyncFunc: {
            forEachAsyncFunction: false,
          },
          prod: {
            production: false,
          },
          dev: {
            development: false,
          },
          env: {
            environment: false,
          },
          db: {
            database: false,
          },
          err: {
            error: false,
          },
          num: {
            number: false,
          },
          sep: {
            separator: false,
          },
          ref: {
            reference: false,
          },
          src: {
            source: false,
          },
          el: {
            element: false,
          },
          req: {
            request: false,
          },
          res: {
            response: false,
            result: false,
          },
          args: {
            arguments: false,
          },
          prop: {
            property: false,
          },
          arr: {
            array: false,
          },
          conf: {
            config: false,
          },
          str: {
            string: false,
          },
          opts: {
            options: false,
          },
          doc: {
            document: false,
          },
          msg: {
            message: false,
          },
          cb: {
            callback: false,
          },
          e: {
            error: false,
            event: false,
          },
          ctx: {
            context: false,
          },
          rel: {
            relationship: false,
            related: false,
            relative: false,
          },
          props: {
            properties: false,
          },
          acc: {
            accumulator: false,
          },
          curr: {
            current: false,
          },
          param: {
            parameter: false,
          },
          params: {
            parameters: false,
          },
        },
      },
    ],

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
