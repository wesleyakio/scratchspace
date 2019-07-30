module.exports = {
  "root": true,
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true,
    "jest": true,
    "jasmine": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 10,
    "sourceType": "module"
  },
  "rules": {
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-var": [
      "error"
    ],
    "no-console": [
      "off"
    ],
    "no-unused-vars": [
      "warn"
    ],
    "no-mixed-spaces-and-tabs": [
      "warn"
    ]
  }
};
