'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = importOnDemand;
function parseName(str) {
    str = str[0].toLowerCase() + str.substr(1);
    return str.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase();
    });
}

function importOnDemand(_ref) {
    var t = _ref.types;

    return {
        name: 'import-on-demand',
        visitor: {
            ImportDeclaration: function ImportDeclaration(path, _ref2) {
                var _ref2$opts = _ref2.opts,
                    opts = _ref2$opts === undefined ? {} : _ref2$opts;

                var node = path.node;
                var libraryName = opts.libraryName,
                    _opts$libraryPath = opts.libraryPath,
                    libraryPath = _opts$libraryPath === undefined ? 'lib' : _opts$libraryPath,
                    _opts$cssPath = opts.cssPath,
                    cssPath = _opts$cssPath === undefined ? undefined : _opts$cssPath,
                    _opts$needImportCSS = opts.needImportCSS,
                    needImportCSS = _opts$needImportCSS === undefined ? false : _opts$needImportCSS;


                if (!libraryName) {
                    console.error('libraryName should be provided in babel-plugin-import-on-demand');
                    return;
                }

                if (node.source.value === libraryName) {
                    node.specifiers.forEach(function (specifier) {
                        if (specifier.type === 'ImportSpecifier') {
                            path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(specifier.imported.name))], t.stringLiteral(libraryName + '/' + libraryPath + '/' + parseName(specifier.imported.name))));
                        }
                    });
                    path.remove();
                }
            }
        }
    };
};