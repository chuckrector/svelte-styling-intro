# Svelte styling intro

IMVU attempts to isolate component styling informally by namespacing. For example, `ProfileIcon.scss` will put all of its styles under a `.profile-icon` rule. In practice, any style in any component may override another because CSS combines all styles globally by design. This total freedom complicates the implementation and maintenance of the application when the styles for any given component of interest are scattered across many files, and especially when they exist in unexpected locations.

Svelte makes each component the boss of its own styles. Nobody else can style a component without its permission: A message list component cannot override the styles of its message list item components or vice versa. The message drawer component cannot override the styles of either. As a result, styles within a component could be considered more stable because it is more difficult for them to be accidentally disrupted by outside influences.

If nobody can style a Svelte component without its permission, how is permission given? The component has at least two options:

1. It can use an escape-hatch syntax that allows it to inherit global styles.
2. It can accept styling suggestions from outside sources.

The first option invites accidental regressions per usual. The second option means that if a component is intended to be able to display itself in various formats, then it should know about all of them and be solely responsible for enforcing them. Svelte components can use "props" to accept input, like styling suggestions, from outside sources. With all the styling for a component occurring in only one place that has a well-defined input, debugging is simplified.

This styling intro demonstrates how to turn IMVU styles into Svelte styles incrementally.

# An overview of the files

* The `code/` directory contains all of the source code.
* The `build/` directory contains all of the build output.
* The `public/` directory is where files are served from, similar to `localhost.imvu.com`. Some files are copied into here from both the `code/` and `build/` directories.
* `s/build` will build the project, part of which includes "deploying" into `public/`.
* `s/dev` will build the project and start a dev server at http://localhost:8000 that will auto-rebuild and refresh the page as you save changes to files. It implements primitive "hot modules reloading".

# Example 1

`App.svelte` contains a small mockup of the IMVU website with all of the markup and styles combined, except for `globalCSS.css` which contains similar boilerplate styling. Pretend that the content of `App.svelte` is the result of building our existing website. It represents the bundled markup and styling for the global nav, conversation list, message list, message list item, chat bubble, and profile icon components.

Profile icons appear in three places:

1. the global nav
2. the conversation list, and
3. the message list.

Examine how they are styled and note that `.profile-icon` has its own styles. Also note that each of these three areas override the profile icon's styles in different ways:

* shifting its layout via margin
* changing its size
* shifting its layout via absolute positioning

In this example, all of these overrides have been placed in a single file and are relatively easy to debug. In the real IMVU codebase, the overrides are scattered across the file system. If you are styling a new component or fixing a styling regression on an existing component, you may or may not know where to look when its styles seem to be getting undesirably influenced by outside sources. If you are new to IMVU, you may struggle to find those sources. Even veterans may struggle!
