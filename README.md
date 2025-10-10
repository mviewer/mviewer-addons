# mviewer-addons

Addons for mviewer v4 or superior compliant with Bootstrap 5.

# Prerequisites

This branch works is only compliant with mviewer Bootstrap 5.

# How to use ?

This repository contains all available addons for mviewer.

You can : 
- take addons one by one (copy an addon to mviewer /apps directory)
- take all of this directory as submodule into mviewer directory

# About library management

If you create a new addon with external javascript library, Check into /lib directory if the library if not already available.
If the needed lib is already inside /lib, just use it.

If not, you will need to import the library's files into /lib directory. This allow other addon to use samed library and avoid too many useless library dupplication.

Finally, set the correct lib path to use it from config.json file : 

```
  "js": [
    "js/print.js",
    "../lib/jquery.easyDrag.min.js",
    "../lib/html2pdf/html2pdf.bundle.min.js"
  ],

```
