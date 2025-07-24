const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPrettierPlugin = require("webpack-prettier-plugin");

module.exports = {
  entry: "./src/js/app.js",
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/html/index.html",
    }),
    new CleanWebpackPlugin(),
    new WebpackPrettierPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            preprocessor: (content, loaderContext) =>
              content.replace(
                /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi,
                (m, src) => {
                  const filePath = path.resolve(loaderContext.context, src);
                  loaderContext.dependency(filePath);
                  return fs.readFileSync(filePath, "utf8");
                },
              ),
          },
        },
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
};
