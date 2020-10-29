const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true, // compress 플러그인 대체 
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];
    // webpack은 next의 기본 설정이 존재한다.
    return {
      ...config,
      mode: prod ? 'production' : 'developement',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins,
    };
  },
});