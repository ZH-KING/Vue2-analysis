/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:10:44
 * @LastEditors: ***
 * @LastEditTime: 2022-09-08 15:04:01
 * @FilePath: \vue2-rollup\rollup.config.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import resolve from '@rollup/plugin-node-resolve'

export default{
    input: './src/index.js',
    output: {
        file: 'dist/vue.js',
        name: 'Vue',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve()
    ]
}