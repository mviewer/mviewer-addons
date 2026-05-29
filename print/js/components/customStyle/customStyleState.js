import { getDefaultCustomStyleOptions } from "./customStyleOptions.js";

const styleState = {
  defaultStyle: getDefaultCustomStyleOptions(),
  blockStyles: {},
  selectedBlockId: "default",
};

/**
 * Reset all stored style overrides to their initial values.
 *
 * @returns {void}
 */
export const resetCustomStyleState = () => {
  styleState.defaultStyle = getDefaultCustomStyleOptions();
  styleState.blockStyles = {};
  styleState.selectedBlockId = "default";
};

/**
 * Return the current default style state.
 *
 * @returns {object}
 */
export const getDefaultStyleState = () => ({ ...styleState.defaultStyle });

/**
 * Replace the default style applied to all blocks without dedicated overrides.
 *
 * @param {object} styleOptions Style values to persist as defaults.
 * @returns {void}
 */
export const setDefaultStyleState = (styleOptions) => {
  styleState.defaultStyle = { ...styleOptions };
};

/**
 * Return the saved style override for a specific block.
 *
 * @param {string} blockId Logical block identifier.
 * @returns {object | null}
 */
export const getBlockStyleState = (blockId) => {
  if (!blockId || !styleState.blockStyles[blockId]) {
    return null;
  }

  return { ...styleState.blockStyles[blockId] };
};

/**
 * Persist a style override for a specific block.
 *
 * @param {string} blockId Logical block identifier.
 * @param {object} styleOptions Style values for the block.
 * @returns {void}
 */
export const setBlockStyleState = (blockId, styleOptions) => {
  if (!blockId || blockId === "default") return;
  styleState.blockStyles[blockId] = { ...styleOptions };
};

/**
 * Remove a saved block-specific style override.
 *
 * @param {string} blockId Logical block identifier.
 * @returns {void}
 */
export const clearBlockStyleState = (blockId) => {
  if (!blockId || blockId === "default") return;
  delete styleState.blockStyles[blockId];
};

/**
 * Return the currently selected style target id.
 *
 * @returns {string}
 */
export const getSelectedBlockId = () => styleState.selectedBlockId;

/**
 * Update the currently selected style target.
 *
 * @param {string} blockId Logical block identifier.
 * @returns {void}
 */
export const setSelectedBlockId = (blockId) => {
  styleState.selectedBlockId = blockId || "default";
};

/**
 * Resolve the effective style for a block, falling back to the default style.
 *
 * @param {string} blockId Logical block identifier.
 * @returns {object}
 */
export const getStyleForBlock = (blockId) => {
  return getBlockStyleState(blockId) || getDefaultStyleState();
};
