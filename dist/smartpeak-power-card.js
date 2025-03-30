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
      if (current >= 1000 || threshold >= 1000) {
        const current_kW = Math.ceil(current / 100) / 10; // ceil to nearest 0.1
        const threshold_kW = Math.ceil(threshold);
        display = `${current_kW} / ${threshold_kW} kW`;
      } else {
        display = `${Math.ceil(current)} / ${Math.ceil(threshold)} W`;
      }
    } else {
      if (current >= 1000) {
        display = `${Math.ceil(current / 100) / 10} kW`;
      } else {
        display = `${Math.ceil(current)} W`;
      }
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
      margin: 1,
      show_threshold: false
    };
  }
}

customElements.define('smartpeak-power-card', SmartpeakPowerCard);
