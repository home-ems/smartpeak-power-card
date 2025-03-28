class SmartpeakPowerCard extends HTMLElement {
  setConfig(config) {
    if (!config.verbruik_entity) {
      throw new Error("verbruik_entity is verplicht.");
    }
    if (!config.piek_entity && typeof config.piek !== 'number') {
      throw new Error("Geef piek_entity of een vaste piek waarde (piek) op.");
    }
    this.config = config;
  }

  set hass(hass) {
    const verbruik = parseFloat(hass.states[this.config.verbruik_entity]?.state ?? 0);
    const piek = this.config.piek_entity
      ? parseFloat(hass.states[this.config.piek_entity]?.state ?? 0)
      : parseFloat(this.config.piek);
    const marge = this.config.marge ?? 1;

    let kleur = 'gray';
    if (verbruik < 0) kleur = 'purple';
    else if (verbruik <= piek) kleur = 'green';
    else if (verbruik <= piek + marge) kleur = 'orange';
    else kleur = 'red';

    const eenheid = verbruik < 1000 ? 'W' : 'kW';
    const waarde = verbruik < 1000 ? verbruik.toFixed(0) : (verbruik / 1000).toFixed(1);

    this.innerHTML = `
      <ha-card style="text-align: center; padding: 16px; color: ${kleur}; font-size: 2em;">
        ${waarde} ${eenheid}
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
      verbruik_entity: "sensor.verbruik_actueel",
      piek: 2.5,
      marge: 1
    };
  }
}

customElements.define('smartpeak-power-card', SmartpeakPowerCard);
