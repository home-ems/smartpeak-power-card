class SmartpeakPowerCardEditor extends HTMLElement {
  setConfig(config) {
    config.type = "custom:smartpeak-power-card";
    this._config = config;
    this._render();
  }

  _render() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .form-row {
          margin-bottom: 12px;
        }
        label {
          display: block;
          margin-bottom: 4px;
          font-weight: bold;
        }
        input[type="text"], input[type="number"] {
          width: 100%;
          padding: 4px;
          box-sizing: border-box;
        }
      </style>
      <div class="form-row">
        <label for="current_power_entity">Current power entity</label>
        <input type="text" id="current_power_entity" value="${this._config.current_power_entity || ''}" placeholder="sensor.current_power">
      </div>
      <div class="form-row">
        <label for="threshold_entity">Threshold entity (optional)</label>
        <input type="text" id="threshold_entity" value="${this._config.threshold_entity || ''}" placeholder="sensor.peak_power">
      </div>
      <div class="form-row">
        <label for="threshold">Fixed threshold (kW, optional)</label>
        <input type="number" id="threshold" value="${this._config.threshold || ''}" step="0.1">
      </div>
      <div class="form-row">
        <label for="margin">Margin (kW)</label>
        <input type="number" id="margin" value="${this._config.margin || 1}" step="0.1">
      </div>
      <div class="form-row">
        <label><input type="checkbox" id="show_threshold" ${this._config.show_threshold ? 'checked' : ''}> Show threshold value</label>
      </div>
      <div class="form-row">
        <label><input type="checkbox" id="force_red" ${this._config.force_red ? 'checked' : ''}> Force red state (for testing)</label>
      </div>
    `;

    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => this._handleChange());
    });
  }

  _handleChange() {
    const config = {
      type: "custom:smartpeak-power-card",
      current_power_entity: this.shadowRoot.getElementById('current_power_entity').value,
      threshold_entity: this.shadowRoot.getElementById('threshold_entity').value || undefined,
      threshold: parseFloat(this.shadowRoot.getElementById('threshold').value) || undefined,
      margin: parseFloat(this.shadowRoot.getElementById('margin').value) || 1,
      show_threshold: this.shadowRoot.getElementById('show_threshold').checked,
      force_red: this.shadowRoot.getElementById('force_red').checked,
    };

    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config } }));
  }

  getConfig() {
    return this._config;
  }

  static getConfigElement() {
    return document.createElement("smartpeak-power-card-editor");
  }
}

customElements.define('smartpeak-power-card-editor', SmartpeakPowerCardEditor);
