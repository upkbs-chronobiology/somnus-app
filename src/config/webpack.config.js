var path = require('path');
var config = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
    config[process.env.IONIC_ENV].resolve.alias = {
        "@environment": path.resolve(__dirname + '/../../src/config/config.' + (process.env.IONIC_ENV || 'prod') + '.ts'),
    };

    // by default mapped to IONIC_SOURCE_MAP_TYPE
    config.dev.devtool = '#inline-source-map';

    return config;
};
