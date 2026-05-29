const dateString = new Date().toLocaleDateString();

/**
 * Default metadata used to create print blocks when a layout does not override them.
 *
 * @type {Object<string, object>}
 */
export const defaultBlocksInfos = {
  title: {
    title: "Titre",
    row: "1 / 2",
    col: "1 / 6",
    placeHolder: document.querySelector(".mv-title").innerHTML,
    type: "text",
    zindex: 6,
  },
  qrcode: {
    col: "6/7",
    row: "1/2",
    type: "qrcode",
    title: "Partage",
    placeholder: "",
    style: "background-color: white",
  },
  informations: {
    title: "Informations",
    row: "1/6",
    col: "1/2",
    placeHolder: `Carte réalisée avec mviewer le ${dateString}`,
    type: "informations",
    zindex: 4,
  },
  comments: {
    title: "Commentaires",
    col: "2 / 7",
    placeHolder: "Aucun commentaire",
    type: "text",
    zindex: 3,
  },
  legend: {
    type: "legend",
    title: "Légende",
    row: "2 / 6",
    col: "5 / 7",
    placeHolder: "",
    zindex: 2,
  },
  mapPrint: { row: "2 / 6", col: "1 / 2", placeHolder: "", title: "Carte", zindex: 1 },
};

/**
 * Default custom style values applied in the print style panel.
 *
 * @type {Object<string, string>}
 */
export const defaultCustomStyleOptions = {
  backgroundColor: "#ffffff",
  borderColor: "#808080",
  fontFamily: "inherit",
  fontSize: "16",
  fontColor: "#1f2937",
};

/**
 * DOM ids of form inputs used to edit print custom styles.
 *
 * @type {Object<string, string>}
 */
export const customStyleInputs = {
  backgroundColor: "print-background-color",
  borderColor: "print-border-color",
  fontFamily: "print-font-family",
  fontSize: "print-font-size",
  fontColor: "print-font-color",
};

/**
 * Labels displayed for selectable print blocks in the custom style panel.
 *
 * @type {Object<string, string>}
 */
export const customStyleBlockLabels = {
  mapPrint: "Carte",
  title: "Titre",
  legend: "Légende",
  informations: "Informations",
  comments: "Commentaires",
  qrcode: "QR Code",
};
