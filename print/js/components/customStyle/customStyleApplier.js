import {
  getCustomStyleInputIds,
  getCustomStyleOptions,
  setCustomStyleInputs,
} from "./customStyleOptions.js";
import { customStyleBlockLabels } from "../../const.js";
import {
  getDefaultStyleState,
  getSelectedBlockId,
  getStyleForBlock,
  resetCustomStyleState,
  setBlockStyleState,
  setSelectedBlockId,
  setDefaultStyleState,
} from "./customStyleState.js";
import { getDefaultCustomStyleOptions } from "./customStyleOptions.js";

/**
 * Return all printable blocks currently rendered in the print grid.
 *
 * @returns {HTMLElement[]}
 */
const getPrintableBlocks = () => [...document.querySelectorAll("#printGridContainer .blockImpress")];

/**
 * Convert a block DOM id to its logical block id.
 *
 * @param {HTMLElement | null | undefined} blockElement Print block element.
 * @returns {string | null}
 */
const getBlockIdFromElement = (blockElement) => blockElement?.id?.replace(/^print-/, "") || null;

/**
 * Get the style target selector element.
 *
 * @returns {HTMLSelectElement | null}
 */
const getTargetSelect = () => document.getElementById("print-style-target");

/**
 * Get the button used to reset custom styles.
 *
 * @returns {HTMLButtonElement | null}
 */
const getResetBlockButton = () => document.getElementById("print-style-reset-block");

/**
 * Return a human-readable label for a block id.
 *
 * @param {string} blockId Logical block identifier.
 * @returns {string}
 */
const getBlockLabel = (blockId) => customStyleBlockLabels[blockId] || blockId;

/**
 * Resolve the main content element inside a print block.
 *
 * @param {HTMLElement} block Print block element.
 * @returns {HTMLElement | null}
 */
const getBlockContentElement = (block) =>
  block.querySelector(".text, .informations, .legend, .qrcode");

/**
 * Apply a style payload to a single rendered block.
 *
 * @param {HTMLElement} block Print block element.
 * @param {object} [styleOptions={}] Style values to apply.
 * @returns {void}
 */
const applyStylesToBlock = (block, styleOptions = {}) => {
  block.style.borderColor = styleOptions.borderColor;

  if (block.id !== "print-mapPrint") {
    const content = getBlockContentElement(block);
    if (content) {
      content.style.backgroundColor = styleOptions.backgroundColor;
      content.style.fontFamily = styleOptions.fontFamily;
      content.style.fontSize = `${styleOptions.fontSize}px`;
      content.style.color = styleOptions.fontColor;
    }
  }

  const badge = block.querySelector(".badge");
  if (badge) {
    badge.style.color = styleOptions.fontColor;
    badge.style.fontFamily = styleOptions.fontFamily;
  }

  block.querySelectorAll(".print-legend-img").forEach((legendItem) => {
    legendItem.style.backgroundColor = styleOptions.backgroundColor;
    legendItem.style.color = styleOptions.fontColor;
    legendItem.style.fontFamily = styleOptions.fontFamily;
    legendItem.style.fontSize = `${styleOptions.fontSize}px`;
    legendItem.style.border = `1px solid ${styleOptions.borderColor}`;
  });
};

/**
 * Highlight the currently selected block in the print preview.
 *
 * @returns {void}
 */
const updateSelectedBlockHighlight = () => {
  const selectedBlockId = getSelectedBlockId();

  getPrintableBlocks().forEach((block) => {
    const isSelected = getBlockIdFromElement(block) === selectedBlockId;
    block.classList.toggle("print-style-selected", isSelected);
  });
};

/**
 * Reflect the current block selection into the style form fields.
 *
 * @returns {void}
 */
const syncStyleInputsWithSelection = () => {
  const selectedBlockId = getSelectedBlockId();
  const selectedStyle =
    selectedBlockId === "default" ? getDefaultStyleState() : getStyleForBlock(selectedBlockId);

  setCustomStyleInputs(selectedStyle);

  const resetButton = getResetBlockButton();
  if (resetButton) {
    resetButton.disabled = false;
  }
};

/**
 * Keep the target selector synchronized with the style state.
 *
 * @returns {void}
 */
const syncTargetSelectValue = () => {
  const targetSelect = getTargetSelect();
  if (targetSelect) {
    targetSelect.value = getSelectedBlockId();
  }
};

/**
 * Reapply the stored custom styles to all visible print blocks.
 *
 * @returns {void}
 */
export const applyCurrentCustomStyles = () => {
  getPrintableBlocks().forEach((block) => {
    applyStylesToBlock(block, getStyleForBlock(getBlockIdFromElement(block)));
  });

  updateSelectedBlockHighlight();
};

/**
 * Persist the currently edited style values for the selected target.
 *
 * @returns {void}
 */
const handleStyleInputChange = () => {
  const selectedBlockId = getSelectedBlockId();
  const currentStyle = getCustomStyleOptions();

  if (selectedBlockId === "default") {
    setDefaultStyleState(currentStyle);
  } else {
    setBlockStyleState(selectedBlockId, currentStyle);
  }

  applyCurrentCustomStyles();
  syncStyleInputsWithSelection();
};

/**
 * Change the active style target and refresh the related UI state.
 *
 * @param {string} blockId Selected target id.
 * @returns {void}
 */
const handleTargetChange = (blockId) => {
  setSelectedBlockId(blockId);
  syncTargetSelectValue();
  syncStyleInputsWithSelection();
  updateSelectedBlockHighlight();
};

/**
 * Bind form inputs used to edit custom style values.
 *
 * @returns {void}
 */
const bindStyleInputEvents = () => {
  getCustomStyleInputIds().forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.oninput = handleStyleInputChange;
    input.onchange = handleStyleInputChange;
  });
};

/**
 * Bind selector and reset actions for the custom style panel.
 *
 * @returns {void}
 */
const bindTargetEvents = () => {
  const targetSelect = getTargetSelect();
  if (targetSelect) {
    targetSelect.onchange = (event) => handleTargetChange(event.target.value);
  }

  const resetButton = getResetBlockButton();
  if (resetButton) {
    resetButton.onclick = (event) => {
      event.preventDefault();
      resetCustomStyleState();
      setCustomStyleInputs(getDefaultCustomStyleOptions());
      syncTargetOptions();
      syncStyleInputsWithSelection();
      applyCurrentCustomStyles();
    };
  }
};

/**
 * Allow direct block selection from the print preview.
 *
 * @returns {void}
 */
const bindBlockSelectionEvents = () => {
  getPrintableBlocks().forEach((block) => {
    block.onclick = (event) => {
      if (event.target.closest(".print-panel-close")) return;
      handleTargetChange(getBlockIdFromElement(block));
    };
  });
};

/**
 * Rebuild the style target options from currently rendered blocks.
 *
 * @returns {void}
 */
const syncTargetOptions = () => {
  const targetSelect = getTargetSelect();
  if (!targetSelect) return;

  const blockOptions = getPrintableBlocks()
    .map((block) => getBlockIdFromElement(block))
    .filter(Boolean)
    .map((blockId) => `<option value="${blockId}">${getBlockLabel(blockId)}</option>`);

  targetSelect.innerHTML = [
    `<option value="default">Tous les blocs (défaut)</option>`,
    ...blockOptions,
  ].join("");

  if (
    getSelectedBlockId() !== "default" &&
    !blockOptions.some((option) => option.includes(`value="${getSelectedBlockId()}"`))
  ) {
    setSelectedBlockId("default");
  }

  syncTargetSelectValue();
};

/**
 * Reinitialize style controls after the modal content is rebuilt.
 *
 * @returns {void}
 */
export const refreshCustomStyleContext = () => {
  syncTargetOptions();
  bindTargetEvents();
  bindStyleInputEvents();
  bindBlockSelectionEvents();
  syncStyleInputsWithSelection();
  updateSelectedBlockHighlight();
};
