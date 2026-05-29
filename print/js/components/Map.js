/**
 *
 * This file is dedicated to print map creation
 * settings key => mapPrint
 * items: {mapPrint: {}}
 *
 */

// north arrow
const defaultNorthImgUrl = "addons/print/img/NorthArrow.png";

// default basemap layers
// Required !
const defaultLayers = [
  new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
];

// scale
const defaultScale = new ol.control.ScaleLine({
  units: ["metric"],
  target: "scaleline-mapPrint",
});

// controls settings
const defaultControls = {
  zoom: false,
  attribution: false,
  rotate: false,
};

// HTML string to render
/**
 * Build the HTML markup required to host the print map and optional north arrow.
 *
 * @param {string} northImgUrl URL of the north arrow image.
 * @returns {string}
 */
const template = (northImgUrl) => {
  const northImg =
    northImgUrl &&
    `<div id="northArrow-mapPrint"><img src="${northImgUrl}" alt="North arrow"/></div>`;
  return `
    <div id="mapBlock">
      <div id="mapPrint" class="map" style="width: 100%;height: 100%;"></div>
      <div id="scaleline-mapPrint" class="scaleline-external"></div> 
      ${northImg}
    </div>`;
};

/**
 * Create OpenLayers map for print Layout
 * @param {array} layers from mviewer
 * @param {object} controls object
 * @returns ol.map
 */
const createMap = (layers, controls) => {
  const view = mviewer.getMap().getView();
  return new ol.Map({
    layers: layers,
    controls: ol.control.defaults.defaults(controls),
    target: "mapPrint",
    view: view,
  });
};

/**
 * Get mviewer map layers list
 * @returns array
 */
const getMviewerMapLayers = () => {
  var baseLayer = mviewer.getActiveBaseLayer();
  var allLayers = mviewer.getMap().getLayers().getArray();
  var layersIds = Object.keys(mviewer.getLayers());

  return allLayers.filter(function (layer) {
    var mviewerId = layer.get("mviewerid");

    // Keep the current map order, with only the active basemap and mviewer layers.
    return layer.get("blid") === baseLayer || layersIds.includes(mviewerId);
  });
};

/**
 * Render and initialize the print map component.
 *
 * @param {string} [northImgUrl] Optional north arrow image URL.
 * @returns {void}
 */
export default function (northImgUrl) {
  $("#print-mapPrint").append(template(northImgUrl || defaultNorthImgUrl));

  const mvMapLayers = getMviewerMapLayers();
  const layers = [...defaultLayers, ...mvMapLayers];

  const map = createMap(layers, defaultControls);
  // Create the scalelines within the two div elements
  map.addControl(defaultScale);
  map.getScale = () => defaultScale;
  mviewer.customComponents.print.printmap = map;
}
