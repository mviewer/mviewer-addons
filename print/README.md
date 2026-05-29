# Mviewer Print extension

This extension provides a map layout interface to create and print a personalised PDF file.

Legend titles can be edited directly in the print modal. Custom values are kept when the modal is closed and reopened during the same session.

![image](https://github.com/jdev-org/mviewer/assets/16317988/e84fd308-e08d-4314-812c-1f1403beba92)

Only A4 (portrail/landscape) are available for this version.

Here, you can find a simple PDF rendered with this mviewer Print extension :

[mviewer-print-example.pdf](https://github.com/jdev-org/mviewer/files/13376242/mviewer-print-example.pdf)

## Installation

By default, Print extension is already available in the `/addons` directory.

So, use this extension as simple mviewer extension.

1. In you config xml file insert :

```
<extensions>
  <extension type="component" id="print" path="addons"/>
</extensions>
```

2. To allow many config by mviewer, add an application id inside <application> element :

```
<application id="my_print_app" title="A super title" />
```

3. Now, open addons/print/config.json file and insert you application id to create a dedicated configuration by mviewer app :

In options (create this key if not available), insert `options.mviewer.applicationid` (change applicationid by application id value) like :

```
"options": {
  "mviewer": {
    "my_print_app": {
    }
  }
}
```

**Now, read the next chapter to set up your app configuration.**

## Configuration

You just have to know that the layout template administration is not required and offer default layout (see next chapter).

Application properties available in the config.json file :

- `printLayouts` : **required** _string_ - layout template (JSON) URL to use
- `ownerLogo` : _string_ - default logo to use in informations area
- `ownerInfos` : _string_ - default text to use in informations area
- `customStyleDefaults` : _object_ - default values used to initialize style inputs in the print modal

  Here a simple example :

```
  "options": {
    "mviewer": {
      "print": {
        "printLayouts": "addons/print/layouts/standard.json",
        "ownerLogo": "https://avatars.githubusercontent.com/u/114171481?s=400&u=7fcf63ac01887ece3f5f2d5527e92c10527c7a91&v=4",
        "ownerInfos": "This is default text to present mviewer map.",
        "customStyleDefaults": {
          "backgroundColor": "#ffffff",
          "borderColor": "#1e90ff",
          "fontFamily": "Georgia, serif",
          "fontSize": "14",
          "fontColor": "#1f2937"
        }
      }
    }
  }
```

Available keys for `customStyleDefaults` :

- `backgroundColor` : _string_ - default background color for blocks
- `borderColor` : _string_ - default border color for blocks
- `fontFamily` : _string_ - default font-family value
- `fontSize` : _string_ - default font size in pixels
- `fontColor` : _string_ - default text color

## Style panel

The print modal contains a `Style` accordion to edit block styles during the current session.

You can:

- apply a default style to all blocks with `Tous les blocs (défaut)`
- select a single block from the target list or by clicking a block in the preview
- apply a specific style only to the selected block
- revert the selected block to the default style with `Revenir au style par défaut`

Default values displayed in this accordion come from `customStyleDefaults` when present in `config.json`.

**That's all ! Now, learn how to manage and use a custom layout with a simple JSON file.**

## Layout with a JSON template

A template represents the configuration of the elements to be printed in a JSON file.

According to the previous configuration, you can use a custom layout template by mviewer application.

The default template is available in `addons/print/layouts/standard.json`.

We will describe it in next chapters to understand how to create you own template (_open standard.json template beside for a better understanding_) .

## Formats & Orientations

A template will contains only one A4 format with 2 available orientation : landscape / portrait.

![image](https://github.com/jdev-org/mviewer/assets/16317988/2247a5a3-8bef-40ad-8c85-09c264e0fa8f)

So, in a JSON template file, you have to keep 2 entry by orientations :

```
{
  "A4_LANDSCAPE" : {...},
  "A4_PORTRAIT": {...}
}
```

> You can rename each of these entries but it's not required and have no impact.

In each object (here A4_LANDSCAPE or A4_PORTRAIT), you will find `landscape <boolean>` option to indicate which config is landscape or portrait.

![image](https://github.com/jdev-org/mviewer/assets/16317988/33344031-e78a-4daf-936b-f53cf2b075e5)

If you remove one of this, only one will be available in print UI.

## Template items

By default, the print extension contains these items :

- map
- legend
- title
- QR code picture
- information area
- comments area

![image](https://github.com/jdev-org/mviewer/assets/16317988/77b466d7-40cf-4245-b3f6-c140948ba0e9)

Each items are resizable and draggable (catch item by click hover grey badge) :

![resize](https://github.com/jdev-org/mviewer/assets/16317988/ced61ebd-fae4-4f40-b5df-514e728d7cb2)

Each item corresponding to a specific key. If a template doesn't contain a key, the corresponding div will not be created and will be not available in the print UI.
So, use this key in the JSON file to set the configuration by item and display / remove an item according to the layout you want.

You can find here the corresponding key for each item :

| Element      | Key          |
| ------------ | ------------ |
| map          | mapPrint     |
| informations | informations |
| comments     | comments     |
| legend       | legend       |
| title        | title        |
| qrcode       | qrcode       |

For the `legend` item, each layer title is editable directly in the print modal. The edited value is preserved when the modal content is rebuilt or reopened, as long as the page is not reloaded.

## Grid system

The Grid system allow to set an item position by columns and row values (6 row and 6 columns by default).

Here, a draw to understand row / col values :

![image](https://github.com/jdev-org/mviewer/assets/16317988/9c0bc7d7-323a-45bc-b118-eecad06033ff)

> Here, find some documentation and playground to understand :
>
> - https://developer.mozilla.org/fr/docs/Web/CSS/grid
> - https://blog.hubspot.fr/website/css-grid
> - https://codepen.io/HubSpot-France/pen/WNJvamo

So, in the layout JSON file, change default values to custom items positions.

Here, mapPrint position in standard layout JSON file :

```
"mapPrint": {
    "row": "2/7",
    "col": "1/5"
},
```

## Global layout settings

These settings are available in root format orientation object :

```
{
  "A4_PORTRAIT": {
    "format": "A4",
    "landscape": false,
    "grid": {
        "rows": "6",
        "col": "6"
    },
    "items": {...}
  },
  "A4_LANDSCAPE": {...}
}
```

Here, read each settings details :

- **format** : _string_ - always "A4" value
- **landscape** : _boolean_ - true for landscape
- **grid** : _object_ - allow to change default grid row and cols number
- **items** : _oject_ - contains each items settings -> **See items settings section**

## Items settings

### Default settings

As explained before, some default items are available and have default settings. But it's required to set you own settings in JSON layout file for each items.

An example to display title and just use default title settings :

```
"items": {
  "title": {},
  "legend": {
    "row": "1/2",
    "col": "5/7"
  }
}
```

### Remove an item

If you don't want title, just remove title entry from JSON.
Also, you can display an item for landscape and remove it for portrait :

```
{
    "A4_LANDSCAPE": {
        ...
        "items": {
            "legend": {...},
            "title": {}
        }
    }
    "A4_LANDSCAPE": {
        ...
        "items": {
            "legend": {...}
        }
    }
}
```

### Item properties

Default elements already have default values :

https://github.com/jdev-org/mviewer/blob/c857f6d839cf028756e4a7f6a86035dbe89cbb94/addons/print/js/const.js#L2-L10

**You can also use these properties to override default values.**

Here, a list of available item properties :

- **type** : _string_ - Don't use for default items. Use "text" to display textarea or empty to display frozen text
- **row** : _string_ - grid row value (e.g "5/7"). Not required with default items.
- **col** : _string_ - grid col value (e.g "1/7"). Not required with default items.
- **zindex** : _integer_ - item z-index (not required). Not required with default items.
- **placeholder** : _string_ - Text to display by default with empty values. Not required with default items.
- **style** : _string_ - Allow to add or override default style properties (e.g `background-color: red`). Not required.
- **class** : _string_ - Allow to add CSS class (e.g `text-right`). Not required.
- **content** : _string_ - HTML content used with `type: "custom"`.

**Example :**

```
"qrcode": {
    "col": "6/6",
    "row": "1/2",
    "type": "qrcode",
    "title": "Partage",
    "placeholder": "",
    "style": "background-color: white",
    "class": "text-center"
}
```

### Custom HTML block

Use `type: "custom"` when you want to personalize the content of a block with your own HTML.

`custom` is a specific block type, different from the standard printed items presented above such as `mapPrint`, `informations`, `legend`, `title` or `qrcode`.

This content is injected as-is in the print modal when blocks are created from the JSON layout configuration.

Example from `layouts/littosat.json` :

```
"customInformationsBlock": {
  "title": "My custom block",
  "row": "6/7",
  "col": "2/4",
  "type": "custom",
  "style":"padding: 20px 10px 5px;",
  "content": "<p class='small px-0 py-0 mx-0 my-0'>Cette carte a été réalisée dans le cadre du projet Littosat</p><img class='print-logo' src='apps/resources/2023_logo_hti_littosat.png'>"
}
```

Implementation details :

- `js/components/ModalContent.js` loops through `layoutJson.items` and creates one block for each declared item.
- `js/components/Block.js` renders the block and, when `type` is `custom`, inserts the `content` value into the block body.

Use this type when built-in blocks (`text`, `legend`, `qrcode`, `informations`) are not sufficient and you need fixed branded or project-specific content.

This type is about customizing the block content, not about creating a new block key in the layout.

### Insert new item

> This system is experimental and may have some bugs. Please report a new issue if you catch a bug.

If you need to insert a new item not present in the default list, add a new unique key in `items` with its own settings.

For this use case, the `Insert new item` section applies. You can then use `type: "custom"` on that new item if you want to fully control its HTML content.

Don't forget to adapt `row` and `col` properties to set your custom item position according to others (see grid system section).

```
**Example**
  "historyText": {
      "col": "6/6",
      "row": "1/2",
      "type": "custom",
      "title": "History",
      "style": "background-color: rgba(213,234,216,0.2)",
      "class": "text-center",
      "content": "<p>History content</p>"
  }
```

![image](https://github.com/jdev-org/mviewer/assets/16317988/9dc5ef01-5751-43fc-8165-5f9a241209a7)
