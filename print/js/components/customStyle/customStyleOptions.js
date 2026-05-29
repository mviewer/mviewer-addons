import { getOptions } from "../Block.js";
import { customStyleInputs, defaultCustomStyleOptions } from "../../const.js";

/**
 * Return the DOM ids of every custom style input.
 *
 * @returns {string[]}
 */
export const getCustomStyleInputIds = () => Object.values(customStyleInputs);

/**
 * Read style defaults provided by the print addon configuration.
 *
 * @returns {object}
 */
const getConfiguredCustomStyleOptions = () => {
  const pluginOptions = getOptions?.() || {};
  return pluginOptions.customStyleDefaults || {};
};

/**
 * Merge hardcoded defaults with configured print style defaults.
 *
 * @returns {object}
 */
export const getDefaultCustomStyleOptions = () => ({
  ...defaultCustomStyleOptions,
  ...getConfiguredCustomStyleOptions(),
});

/**
 * Read the current custom style form values.
 *
 * @returns {object}
 */
export const getCustomStyleOptions = () => {
  const defaultOptions = getDefaultCustomStyleOptions();

  return Object.entries(customStyleInputs).reduce((options, [key, inputId]) => {
    const input = document.getElementById(inputId);
    options[key] = input?.value || defaultOptions[key];
    return options;
  }, {});
};

/**
 * Populate the custom style form with the provided values.
 *
 * @param {object} [styleOptions={}] Partial or full style options.
 * @returns {void}
 */
export const setCustomStyleInputs = (styleOptions = {}) => {
  const mergedOptions = { ...getDefaultCustomStyleOptions(), ...styleOptions };

  Object.entries(customStyleInputs).forEach(([key, inputId]) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = mergedOptions[key];
    }
  });
};
