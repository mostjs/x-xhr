import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [babel({
    babelrc: false,
    presets: ['es2015-rollup', 'flow']
  })],
  external: [
    '@most/scheduler'
  ],
  output: [{
    file: pkg.module,
    format: 'es',
    sourcemap: true
  }, {
    file: pkg.main,
    format: 'umd',
    name: 'mostXHR',
    globals: {
      '@most/scheduler': 'mostScheduler'
    },
    sourcemap: true
  }]
}
