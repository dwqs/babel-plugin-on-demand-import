const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const babel = require('babel-core');

const onDemandimport = require('../lib/index').default;

describe('on demand import', () => {
    it('libraryName', () => {
        const result = babel.transform('import { A } from "test"', {
            plugins: [[onDemandimport, {
                libraryName: 'test'
            }]]
        });
        const expected = 'import A from "test/lib/a";';
        expect(expected === result.code).to.be.true;
    });

    it('libraryPath', () => {
        const result = babel.transform('import { AaCc, BbDd } from "test"', {
            plugins: [[onDemandimport, {
                libraryName: 'test',
                libraryPath: 'dist'
            }]]
        });
        expect(result.code).to.include('import AaCc from "test/dist/aa-cc"');
        expect(result.code).to.include('import BbDd from "test/dist/bb-dd"');
        expect(result.code).to.not.include('import { AaCc, BbDd } from "test"');
    });

    it('Array', () => {
        const result = babel.transformFileSync(path.resolve(__dirname, 'array-code.js'), {
            plugins: [[onDemandimport, [
                {
                    libraryName: 'test1',
                    libraryPath: 'dist/my-library',
                    stylePath: 'style1',
                    needImportStyle: true
                },
                {
                    libraryName: 'test2',
                    libraryPath: 'dist',
                    stylePath: 'style2',
                    needImportStyle: true
                }
            ]]]
        });
        fs.writeFileSync(path.resolve(__dirname, 'array-code-test-result.js'), result.code);
        const expected = fs.readFileSync(path.resolve(__dirname, 'array-code-test-result.js')).toString();
        
        expect(expected === result.code).to.be.true;
    });
});
