/**
 * Method to insert button inside mviewer right toolbar
 */
export const createToolbarButton = () => {
    var button = `
        <button id="timebtn" class="btn btn-light btn-raised"
            onclick="mviewer.customComponents['seasons-selector'].showPanel();"  title="Temporalité"
            tabindex="116" accesskey="f">
            <i class="fas fa-history"></i>
            </span>
        </button>`;
    $("#toolstoolbar").prepend(button);
    $("#timebtn").css("color", "black");
}