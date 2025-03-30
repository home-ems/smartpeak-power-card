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
    const forceRed = this.config.force_red ?? false;

    let color = 'gray';
    if (current < 0) {
      color = 'purple';
    } else if (forceRed || current >= threshold) {
      color = 'red';
    } else if (current >= threshold - margin) {
      color = 'orange';
    } else {
      color = 'green';
    }

    let display = '';

    const currentFormatted = current >= 1000
      ? `${(Math.ceil(current / 100) / 10).toFixed(1)} kW`
      : `${Math.ceil(current)} W`;

    if (showThreshold) {
      const thresholdFormatted = threshold >= 1000
        ? `${(Math.ceil(threshold / 100) / 10).toFixed(1)} kW`
        : `${Math.ceil(threshold)} W`;

      display = `<span style="color:${color}">${currentFormatted}</span> <span style="color:white">/ ${thresholdFormatted}</span>`;
    } else {
      display = `<span style="color:${color}">${currentFormatted}</span>`;
    }

    const cardClass = color === 'red' ? 'smartpeak-red-card' : 'smartpeak-normal-card';

    this.innerHTML = `
      <ha-card class="${cardClass}">
        ${display}
      </ha-card>
      <style>
        .smartpeak-red-card {
          background-color: red;
          color: white;
          text-align: center;
          padding: 16px;
          font-size: 2em;
          animation: fadeInOut 1s ease-in-out infinite alternate;
        }
        .smartpeak-normal-card {
          text-align: center;
          padding: 16px;
          font-size: 2em;
        }
        @keyframes fadeInOut {
          0% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      </style>
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
      show_threshold: false,
      force_red: false
    };
  }
}

customElements.define('smartpeak-power-card', SmartpeakPowerCard);
