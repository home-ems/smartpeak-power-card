class SmartpeakPowerCard extends HTMLElement {
  setConfig(config) {
    if (!config.current_power_entity) {
      throw new Error("current_power_entity is required.");
    }
    if (!config.threshold_entity && typeof config.threshold !== 'number') {
      throw new Error("Provide either threshold_entity or a fixed threshold value.");
    }
    this.config = config;
  }

  set hass(hass) {
    const current = parseFloat(hass.states[this.config.current_power_entity]?.state ?? 0);
    const threshold = this.config.threshold_entity
      ? parseFloat(hass.states[this.config.threshold_entity]?.state ?? 0)
      : parseFloat(this.config.threshold);
    const margin = this.config.margin ?? 1;
    const showThreshold = this.config.show_threshold ?? false;

    let color = 'gray';
    if (current < 0) color = 'purple';
    else if (current <= threshold) color = 'green';
    else if (current <= threshold + margin) color = 'orange';
    else color = 'red';

    let display = '';

    if (showThreshold) {
      const currentFormatted = current >= 1000
        ? `${(Math.ceil(current / 100) / 10).toFixed(1)} kW`
        : `${Math.ceil(current)} W`;
      const thresholdFormatted = threshold >= 1000
        ? `${(Math.ceil(threshold / 100) / 10).toFixed(1)} kW`
        : `${Math.ceil(threshold)} W`;

      display = `<span style="color:${color}">${currentFormatted}</span> <span style="color:white">/ ${thresholdFormatted}</span>`;
    } else {
      display = current >= 1000
        ? `${(Math.ceil(current / 100) / 10).toFixed(1)} kW`
        : `${Math.ceil(current)} W`;
    }

    this.innerHTML = `
      <ha-card style="text-align: center; padding: 16px; font-size: 2em;">
        ${display}
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
  }

  static getConfigElement() {
    const element = document.createElement("hui-entities-card-editor");
    return element;
  }

  static getStubConfig() {
    return {
      current_power_entity: "sensor.current_power",
      threshold: 2500,
      margin: 1,
      show_threshold: false
    };
  }
}

customElements.define('smartpeak-power-card', SmartpeakPowerCard);
