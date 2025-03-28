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

    let color = 'gray';
    if (current < 0) color = 'purple';
    else if (current <= threshold) color = 'green';
    else if (current <= threshold + margin) color = 'orange';
    else color = 'red';

    let unit = 'W';
    let display = `${current.toFixed(0)} W`;
    if (current >= 1000) {
      const current_kW = (current / 1000).toFixed(1);
      const threshold_kW = (threshold).toFixed(1);
      display = `${current_kW} / ${threshold_kW} kW`;
      unit = 'kW';
    }

    this.innerHTML = `
      <ha-card style="text-align: center; padding: 16px; color: ${color}; font-size: 2em;">
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
      threshold: 2.5,
      margin: 1
    };
  }
}

customElements.define('smartpeak-power-card', SmartpeakPowerCard);
