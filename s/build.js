Error.stackTraceLimit = Infinity;

let esbuild = require('esbuild');
let fs = require('node:fs');
let path = require('node:path');
let svelte = require('svelte/compiler');

// NOTE(chuck): This is copied verbatim from https://esbuild.github.io/plugins/#svelte-plugin
let sveltePlugin = {
    name: 'svelte',
    setup(build) {
        build.onLoad({
            filter: /\.svelte$/,
        }, async (args) => {
            // This converts a message in Svelte's format to esbuild's format
            let convertMessage = ({message, start, end}) => {
                let location;
                if (start && end) {
                    let lineText = source.split(/\r\n|\r|\n/g)[start.line - 1];
                    let lineEnd  = (start.line === end.line) ? end.column : lineText.length;
                    location = {
                        file: filename,
                        line: start.line,
                        column: start.column,
                        length: lineEnd - start.column,
                        lineText,
                    };
                }
                return {
                    text: message,
                    location,
                };
            };

            // Load the file from the file system
            let source = await fs.promises.readFile(args.path, 'utf8');
            let filename = path.relative(process.cwd(), args.path);

            // Convert Svelte syntax to JavaScript
            try {
                let {js, warnings} = svelte.compile(source, {filename});
                let contents = js.code + `//# sourceMappingURL=` + js.map.toUrl();
                return {
                    contents,
                    warnings: warnings.map(convertMessage),
                };
            } catch (e) {
                return {
                    errors: [convertMessage(e)]
                };
            }
        });
    }
};

async function build() {
    await esbuild.build({
        entryPoints: ['code/App.svelte'],
        bundle: true,
        format: 'esm',
        outfile: 'build/bundle.js',
        plugins: [sveltePlugin],
    });

    try {
        await fs.promises.mkdir('public');
    } catch (error) {
        if (error.code != 'EEXIST') {
            throw error;
        }
    }

    await Promise.all([
        fs.promises.copyFile('build/bundle.js', 'public/bundle.js'),
        fs.promises.copyFile('code/index.html', 'public/index.html'),
        fs.promises.copyFile('code/globalCSS.css', 'public/globalCSS.css'),
        fs.promises.copyFile('code/HCo_fonts.css', 'public/HCo_fonts.css'),
    ]);
};

exports.build = build;

if (require.main.filename === __filename) {
    (async function buildFromTheCommandLine() {
        await build(process.argv);
        console.log('Build finished.');
    })();
}
