

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const pkg = require('./package.json');


require('babel-core/register')({presets: ['env']});



let libraryName = pkg.name;
let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = libraryName + '.min.js';
} else {
  mode = 'development';
  outputFile = libraryName + '.js';
}






var config = {

    // mode : mode,
    entry   : __dirname + '/src/load_firefly.js',
    devtool : 'source-map',
    output: {
        path: __dirname + '/distribution',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
      },

    module : {
        rules: [ {
            test : /\.(js)$/,
            include: [__dirname + '/src'],
            loader: 'babel-loader',
            query: {
                // later presets run before earlier for each AST node
                // use 'es2015', {modules: false}] for es5 with es6 modules
                presets: [
                    ['env',
                        {
                            targets: {
                                browsers: ['safari >= 9', 'chrome >= 62', 'firefox >= 56', 'edge >= 14']
                            },
                            debug: mode!=='development',
                            modules: false,  // preserve application module style - in our case es6 modules
                            useBuiltIns : true
                        }
                    ],
                    'stage-3'],
                plugins: ['transform-runtime']
            }
        } ],
    },

    resolve : {
        extensions : ['.json', '.js'],
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
    },

};


module.exports= config;
