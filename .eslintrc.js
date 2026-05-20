module.exports = {
  extends: ["expo", "prettier"],
  ignorePatterns: ["node_modules/", "dist/", ".expo/"],
  rules: {
    "react/no-unescaped-entities": "off"
  }
};
