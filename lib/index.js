'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onDemandImport;
function parseName(str) {
    str = str[0].toLowerCase() + str.substr(1);
    return str.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase();
    });
}

function onDemandImportPlugin(path, t, opts) {
    var libraryName = opts.libraryName,
        _opts$libraryPath = opts.libraryPath,
        libraryPath = _opts$libraryPath === undefined ? 'lib' : _opts$libraryPath,
        _opts$stylePath = opts.stylePath,
        stylePath = _opts$stylePath === undefined ? undefined : _opts$stylePath,
        _opts$needImportStyle = opts.needImportStyle,
        needImportStyle = _opts$needImportStyle === undefined ? false : _opts$needImportStyle;

    if (!libraryName) {
        console.error('libraryName should be provided in babel-plugin-import-on-demand');
        return;
    }

    var node = path.node;
    if (node && node.source.value === libraryName) {
        node.specifiers.forEach(function (specifier) {
            if (specifier.type === 'ImportSpecifier') {
                path.insertBefore(t.importDeclaration([t.importDefaultSpecifier(t.identifier(specifier.imported.name))], t.stringLiteral(libraryName + '/' + libraryPath + '/' + parseName(specifier.imported.name))));

                if (stylePath && needImportStyle) {
                    path.insertBefore(t.importDeclaration([], t.stringLiteral(libraryName + '/' + stylePath + '/' + parseName(specifier.imported.name) + '.css')));
                }
            }
        });
        path.remove();
    }
}

function onDemandImport(_ref) {
    var t = _ref.types;

    return {
        name: 'on-demand-import',
        visitor: {
            ImportDeclaration: function ImportDeclaration(path, _ref2) {
                var _ref2$opts = _ref2.opts,
                    opts = _ref2$opts === undefined ? {} : _ref2$opts;

                if (Object.prototype.toString.call(opts) === '[object Array]') {
                    opts.forEach(function (opt) {
                        onDemandImportPlugin(path, t, opt);
                    });
                } else {
                    onDemandImportPlugin(path, t, opts);
                }
            }
        }
    };
};