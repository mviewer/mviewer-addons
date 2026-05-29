/**
 * Render the custom style accordion displayed in the print options panel.
 *
 * @returns {string}
 */
export default () => `
  <div class="accordion my-4" id="print-style-accordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="print-style-heading">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#print-style-collapse"
          aria-expanded="false"
          aria-controls="print-style-collapse"
        >
          Style
        </button>
      </h2>
      <div
        id="print-style-collapse"
        class="accordion-collapse collapse"
        aria-labelledby="print-style-heading"
        data-bs-parent="#print-style-accordion"
      >
        <div class="accordion-body">
          <div class="mb-3 print-style-field-row">
            <label for="print-style-target" class="form-label mb-0">Cible</label>
            <select id="print-style-target" class="form-select">
              <option value="default">Tous les blocs (défaut)</option>
            </select>
          </div>
          <div class="mb-3 print-style-field-row print-style-color-row">
            <label for="print-background-color" class="form-label mb-0">Couleur du fond</label>
            <input id="print-background-color" type="color" class="form-control form-control-color" value="#ffffff">
          </div>
          <div class="mb-3 print-style-field-row print-style-color-row">
            <label for="print-border-color" class="form-label mb-0">Couleur du trait du bloc</label>
            <input id="print-border-color" type="color" class="form-control form-control-color" value="#808080">
          </div>
          <div class="mb-3 print-style-field-row print-style-size-row">
            <label for="print-font-size" class="form-label mb-0">Taille de police</label>
            <input id="print-font-size" type="number" min="8" max="48" step="1" class="form-control" value="16">
          </div>
          <div class="mb-3 print-style-field-row print-style-color-row">
            <label for="print-font-color" class="form-label mb-0">Couleur de police</label>
            <input id="print-font-color" type="color" class="form-control form-control-color" value="#1f2937">
          </div>
          <div class="mb-0 print-style-field-row">
            <label for="print-font-family" class="form-label mb-0">Type de police</label>
            <select id="print-font-family" class="form-select">
              <option value="inherit">Par défaut</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica Neue</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>
          <div class="mt-3 d-flex justify-content-end default-style-bloc">
            <button type="button" id="print-style-reset-block" class="btn btn-outline-secondary btn-sm">
              Revenir au style par défaut
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
