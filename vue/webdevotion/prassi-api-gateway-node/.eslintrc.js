module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:security/recommended',
    'plugin:array-func/recommended',
    'prettier',
    'airbnb-base',
    'eslint-config-prettier',
  ],
  plugins: [
    'node',
    'array-func',
    'jest',
    'optimize-regex',
    'prettier',
    'promise',
    'sql',
    'security',
    'unicorn',
    'jsdoc',
    'sonarjs',
  ],
  parserOptions: {
    ecmaVersion: 2019,
    impliedStrict: true,
  },
  env: {
    browser: false,
    node: true,
    jest: true,
    es6: true,
    worker: false,
    serviceworker: false,
  },
  rules: {
    "no-param-reassign": 0,
    'unicorn/consistent-function-scoping': 'error',
    'max-len': ['error', { code: 120 }],
    'object-curly-newline': ['error', { consistent: true }],
    'array-func/prefer-array-from': 'off',
    'function-paren-newline': 'off',
    'no-underscore-dangle': 'off',
    'unicorn/numeric-separators-style': 'off',
    'optimize-regex/optimize-regex': 'warn',
    'arrow-parens': ['error', 'always'],
    'operator-linebreak': 'off',
    'implicit-arrow-linebreak': 'off',
    'promise/no-return-wrap': 'off',
    'jest/no-conditional-expect': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/consistent-destructuring': 'off',
    'jsdoc/require-hyphen-before-param-description': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-array-push-push': 'off',
    'unicorn/no-array-method-this-argument': 'off',
    semi: 'error',
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

    'sql/format': [
      'error',
      {
        ignoreExpressions: false,
        ignoreInline: true,
        ignoreTagless: true,
      },
    ],
    'sql/no-unsafe-query': [
      'error',
      {
        allowLiteral: false,
      },
    ],

    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['mockdate'],
      },
    ],

    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          fiscalCodeAttachmentObj: {
            fiscalCodeAttachmentObject: false,
          },
          i: {
            index: false,
          },
          idx: {
            index: false,
          },
          fb: {
            function_: false,
          },
          forEachAsyncFunc: {
            forEachAsyncFunc: false,
          },
          lib: {
            library: false,
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
          params: {
            parameters: false,
          },
          acc: {
            accumulator: false,
          },
          curr: {
            current: false,
          },
        },
      },
    ],

    'security/detect-non-literal-fs-filename': 0,

    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 0,
    'jsdoc/check-types': 'error',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/no-undefined-types': 1,
    'jsdoc/require-description-complete-sentence': 0,
    'jsdoc/require-example': 0,
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 0,
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-returns-type': 'error',

    'sonarjs/cognitive-complexity': 'error',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-extra-arguments': 'error',
    'sonarjs/no-element-overwrite': 'error',
    'sonarjs/no-one-iteration-loop': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-redundant-boolean': 'warn',
    'sonarjs/no-small-switch': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-while': 'warn',
  },
};
