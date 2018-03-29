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
                // Supports as operator(fix #1)
                const importedName = specifier.imported.name;
                const localName = specifier.local.name;
                const finalName = importedName === localName ? importedName : localName;

                path.insertBefore(
                    t.importDeclaration(
                        [t.importDefaultSpecifier(t.identifier(finalName))],
                        t.stringLiteral(`${libraryName}/${libraryPath}/${parseName(importedName)}`)
                    )
                );

                if (stylePath && needImportStyle) {
                    path.insertBefore(
                        t.importDeclaration(
                            [],
                            t.stringLiteral(`${libraryName}/${stylePath}/${parseName(importedName)}.css`)
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
