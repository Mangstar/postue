const path = require('path');

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));

    config.resolve.alias.set('faker', path.resolve(__dirname, 'faker'));
  }
};

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/scss/_parts/_helpers.scss')
      ]
    });
}
