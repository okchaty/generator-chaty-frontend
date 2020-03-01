'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const slugify = require('slugify')

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.magentaBright('Chaty Frontend')} Yo generator!`)
    );

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'appname',
        message: 'Your project name',
        default: slugify(this.appname), // Default to current folder name
        validate: function (answer) {
          var match = answer.match(/^[0-9a-zA-Z\-]+$/);
          return (match) ? true : 'Please enter a valid subdomain (letters, numbers and hyphen)';
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description'
      },
      {
        type: 'input',
        name: 'src',
        message: 'Frontend source folder',
        default: 'frontdev/'
      },
      {
        type: 'input',
        name: 'dist',
        message: 'Frontend dist folder',
        default: 'src/assets/'
      },
      {
        type: 'input',
        name: 'mainJs',
        message: 'Your main js name (without extension)',
        default: 'index'
      },
      {
        type: 'confirm',
        name: 'hasVue',
        message: 'Would you like to add Vue?'
      }
    ]);

    if (this.answers.hasVue) {
      await this.prompt([
        {
          type: 'input',
          name: 'q1',
          message: `Do not forget fix vue router file (${this.answers.src}js/router/${this.answers.mainJs}.js)`,
        },
      ]);
    }
  }

  writing() {
    // Config Files
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.answers
    );

    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
    );

    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    );

    this.fs.copyTpl(
      this.templatePath('webpack/config.js'),
      this.destinationPath('webpack/config.js'),
      this.answers
    );

    // Frontend files
    mkdirp.sync(`${this.answers.src}/img`);

    this.fs.copyTpl(
      this.templatePath(`frontdev/index.js`),
      this.destinationPath(`${this.answers.src}js/${this.answers.mainJs}.js`),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath(`frontdev/index.scss`),
      this.destinationPath(`${this.answers.src}scss/${this.answers.mainJs}.scss`),
      this.answers
    );

    // Add Vue files if user accept install vue
    if (this.answers.hasVue) {
      this.fs.copyTpl(
        this.templatePath(`frontdev/index.vue`),
        this.destinationPath(`${this.answers.src}vue/${this.answers.mainJs}.vue`),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath(`frontdev/router.js`),
        this.destinationPath(`${this.answers.src}js/router/${this.answers.mainJs}.js`),
        this.answers
      );
    }

    // Install dependencies
    this.yarnInstall([
      'chaty-style',
      'axios'
    ]);

    if (this.answers.hasVue) {
      this.yarnInstall([
        'vue',
        'vue-router'
      ]);
    }

    // Install dev dependencies
    this.yarnInstall([
      '@babel/core',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/preset-env',
      'autoprefixer',
      'babel-loader',
      'clean-webpack-plugin',
      'copy-webpack-plugin',
      'css-loader',
      'mini-css-extract-plugin',
      'node-sass',
      'optimize-css-assets-webpack-plugin',
      'postcss-loader',
      'postcss-safe-parser',
      'sass-loader',
      'style-loader',
      'webpack',
      'webpack-cli'
    ], { 'dev': true });

    if (this.answers.hasVue) {
      this.yarnInstall([
        'vue-loader',
        'vue-style-loader',
        'vue-template-compiler',
      ], { 'dev': true });
    }
  }
};
