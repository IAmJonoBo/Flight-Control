export default {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "babel-plugin-transform-import-meta",
    [
      "babel-plugin-transform-vite-meta-env",
      {
        env: {
          VITE_API_URL: "http://localhost:8000",
        },
      },
    ],
  ],
};
