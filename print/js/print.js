import ToolbarButton from "./components/ToolbarButton.js";

import {
  applyCurrentBlockStyles,
  initOptions,
} from "./utils/printOptions.js";
import {
  getDefaultCustomStyleOptions,
  setCustomStyleInputs,
} from "./components/customStyle/customStyleOptions.js";
import {
  refreshCustomStyleContext,
} from "./components/customStyle/customStyleApplier.js";
import { resetCustomStyleState } from "./components/customStyle/customStyleState.js";

import { filterCheckBox, iniCheckBox } from "./utils/controls.js";

import { downloadPDF, displayPDF, displayAsPng } from "./utils/pdf.js";
import { downloadLayouts, getSelectedLayout } from "./utils/layout.js";
import { defaultLayout } from "./utils/defaultLayout.js";
import ModalContent from "./components/ModalContent.js";

import { getOptions } from "./components/Block.js";

/**
 * Bind modal close cleanup to remove recreated print blocks and map container.
 *
 * @returns {void}
 */
const onCloseModal = () => {
  const btnClose = document.getElementById("closePrintModal");
  btnClose.onclick = () => {
    document.querySelector("#mapBlock").remove();
    document.querySelector("#print-mapPrint").remove();
    btnClose.removeAttribute("onclick");
  };
};

/**
 * Initialize modal listeners and print actions for a resolved layout configuration.
 *
 * @param {Object<string, object>} layout Layout definitions loaded from config.
 * @returns {void}
 */
const initWithLayout = (layout) => {
  $("#printModal").on("shown.bs.modal", function () {
    // supprime et recréer la carte seulement et non toute la modal
    $("#printModal").modal("show");
    // init options
    initOptions(layout);
    // init modal
    const layoutToUse = getSelectedLayout(layout);
    ModalContent(layoutToUse);
    refreshCustomStyleContext();
    applyCurrentBlockStyles();
    // manage checkbox display
    filterCheckBox(layoutToUse);
    // init checbox check event
    iniCheckBox();
    document.querySelector(".print-reset-btn").addEventListener("click", () => {
      // init modal
      const layoutSelected = getSelectedLayout(layout);
      resetCustomStyleState();
      setCustomStyleInputs(getDefaultCustomStyleOptions());
      ModalContent(layoutSelected);
      refreshCustomStyleContext();
      applyCurrentBlockStyles();
    });
  });
  // preview PDF button listener
  document.querySelectorAll(".print-preview-btn").forEach((z) =>
    z.addEventListener("click", (evt) => {
      const isLandscape =
        document.getElementById("print-select-orientation").value == "true";
      displayPDF({
        jsPDF: {
          unit: "mm",
          format: "A4",
          orientation: isLandscape ? "landscape" : "portrait",
        },
      });
    })
  );
  // download PNG button listener
  document.querySelector(".print-png-btn").addEventListener("click", (evt) => {
    const isLandscape =
      document.getElementById("print-select-orientation").value == "true";
    displayAsPng({
      jsPDF: {
        unit: "mm",
        format: "A4",
        orientation: isLandscape ? "landscape" : "portrait",
      },
    });
  });
  // download PDF button listener
  document.querySelectorAll(".print-download-btn").forEach((z) =>
    z.addEventListener("click", (evt) => {
      const isLandscape =
        document.getElementById("print-select-orientation").value == "true";
      downloadPDF({
        jsPDF: {
          unit: "mm",
          format: "A4",
          orientation: isLandscape ? "landscape" : "portrait",
        },
      });
    })
  );

  // on modal close
  onCloseModal();
};

/**
 * Bootstrap the print addon and load configured layouts.
 *
 * @returns {void}
 */
const init = () => {
  // call json template file to render layout
  downloadLayouts(getOptions().printLayouts)
    .then((jsonLayout) => initWithLayout(jsonLayout))
    .catch((err) => {
      initWithLayout(defaultLayout);
      console.log(err);
    });
  return ToolbarButton();
};

new CustomComponent("print", init);
