var basePaths = {
  src: '<%= src %>',
  dist: '<%= dist %>'
};

module.exports = {
  debug: process.env.NODE_ENV == "development",

  basePaths: basePaths,

  paths: {
    images: {
      src: basePaths.src + 'img/',
      dist: '../img/',
    },
    scripts: {
      src: basePaths.src + 'js/',
      dist: basePaths.dist + 'js/'
    },
    styles: {
      dist: '../css/',
    },
  },

  entries: [
    {
      name: '<%= mainJs %>',
      entry: '<%= mainJs %>.js',
    },
  ],
};