import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: pkg.source,
  plugins: [
    babel(),
    terser({
      module: true,
    })
  ],
  output: [
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'umd',
      name: 'virtual-list',
      file: pkg['umd:main'],
    },
    {
      format: 'es',
      file: pkg.module,
    },
  ]
};
