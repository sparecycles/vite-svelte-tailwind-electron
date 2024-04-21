const nest = require("tailwindcss/nesting");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const config = {
  plugins: [nest(), tailwindcss(), autoprefixer()],
};

module.exports = config;
