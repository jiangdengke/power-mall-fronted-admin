'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || 8081 // dev port

module.exports = {
  publicPath: '/', // 部署应用的基础url
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'static', // 静态资源目录
  lintOnSave: process.env.NODE_ENV === 'development', // 开发过程启用eslint检查
  productionSourceMap: false, // 不生成source map文件，source map文件是
  // 配置代理转发
  devServer: {
    port: port, // 开发服务器端口
    open: true, // 自动打开浏览器
    overlay: { // 错误提示配置
      warnings: false,
      errors: true
    },
    proxy: {
      // 当请求路径以 '/api' 开头时，会被代理到目标服务器
      '/api': {
        target: 'http://localhost:8080', // 后端服务器地址
        changeOrigin: true, // 支持跨域
        pathRewrite: {
          '^/api': '' // 重写路径，去掉 '/api' 前缀
        }
      }
    }
  },
  configureWebpack: {
    name: 'power-mall后台管理系统', // 项目名称
    resolve: {
      alias: {
        '@': resolve('src') // 路径别名，可以用@代替src路径
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // 配置cdn
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
