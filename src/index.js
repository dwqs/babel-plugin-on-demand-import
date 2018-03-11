function parseName (str) {
    str = str[0].toLowerCase() + str.substr(1);
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`);
}

export default function importOnDemand ({types: t}) {
    return {
        visitor: {
            ImportDeclaration (path, { opts = {} }) {
                const node = path.node;
                const { libraryName, libraryPath = 'lib', cssPath = undefined, needImportCSS = false } = opts;
                
                if (!libraryName) {
                    console.error('libraryName should be provided in babel-plugin-import-on-demand');
                    return;
                }

                if (node.source.value === libraryName) {
                    node.specifiers.forEach(specifier => {
                        if (specifier.type === 'ImportSpecifier') {
                            path.insertBefore(
                                t.importDeclaration(
                                    [t.importDefaultSpecifier(t.identifier(specifier.imported.name))],
                                    t.stringLiteral(`${libraryName}/${lib}/${parseName(specifier.imported.name)}`)
                                )
                            )
                        }
                    });
                    path.remove();
                }
            }
        }
    }
};
