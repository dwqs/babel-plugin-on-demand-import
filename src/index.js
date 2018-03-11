function parseName (str) {
    str = str[0].toLowerCase() + str.substr(1);
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`);
}

function onDemandImportPlugin (path, t, opts) {
    const { libraryName, libraryPath = 'lib', stylePath = undefined, needImportStyle = false } = opts;
    if (!libraryName) {
        console.error('libraryName should be provided in babel-plugin-import-on-demand');
        return;
    }

    const node = path.node;
    if (node && node.source.value === libraryName) {
        node.specifiers.forEach(specifier => {
            if (t.isImportSpecifier(specifier)) {
                path.insertBefore(
                    t.importDeclaration(
                        [t.importDefaultSpecifier(t.identifier(specifier.imported.name))],
                        t.stringLiteral(`${libraryName}/${libraryPath}/${parseName(specifier.imported.name)}`)
                    )
                );

                if (stylePath && needImportStyle) {
                    path.insertBefore(
                        t.importDeclaration(
                            [],
                            t.stringLiteral(`${libraryName}/${stylePath}/${parseName(specifier.imported.name)}.css`)
                        )
                    );
                }
            }
        });
        path.remove();
    }
}

export default function onDemandImport ({types: t}) {
    return {
        name: 'on-demand-import',
        visitor: {
            ImportDeclaration (path, { opts = {} }) {
                if (Object.prototype.toString.call(opts) === '[object Array]') {
                    opts.forEach(opt => {
                        onDemandImportPlugin(path, t, opt);
                    });
                } else {
                    onDemandImportPlugin(path, t, opts);
                }
            }
        }
    };
};
