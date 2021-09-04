export class SwitcherControl {

  constructor(onBeforeSwitch, onAfterSwitch) {
    this.onBeforeSwitch = onBeforeSwitch;
    this.onAfterSwitch = onAfterSwitch;
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.styles = [];
    this.currentStyle = null;
  }

  getDefaultPosition() {
    return 'top-right';
  }

  updateStyles(updatedStyles, selectedStyle) {
    this.styles = updatedStyles;

    while (this.mapStyleContainer.firstChild) {
      this.mapStyleContainer.removeChild(this.mapStyleContainer.firstChild);
    }

    let selectedStyleElement;

    for (const style of this.styles) {
      const styleElement = document.createElement('button');
      styleElement.type = 'button';
      styleElement.innerText = style.title;
      styleElement.dataset.id = style.id;
      styleElement.dataset.uri = JSON.stringify(style.uri);
      styleElement.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.classList.contains('active')) {
          this.onSelectStyle(target);
        }
      });
      if (style.id === selectedStyle) {
        selectedStyleElement = styleElement;
        styleElement.classList.add('active');
      }
      this.mapStyleContainer.appendChild(styleElement);
    }

    if (this.currentStyle !== selectedStyle) {
      this.onSelectStyle(selectedStyleElement);
    }
  }

  onSelectStyle(target) {
    this.onBeforeSwitch();

    this.map.setStyle(JSON.parse(target.dataset.uri));

    this.mapStyleContainer.style.display = 'none';
    this.styleButton.style.display = 'block';

    const elements = this.mapStyleContainer.getElementsByClassName('active');
    while (elements[0]) {
      elements[0].classList.remove('active');
    }
    target.classList.add('active');

    this.onAfterSwitch();
  }

  onAdd(map) {
    this.map = map;
    this.controlContainer = document.createElement('div');
    this.controlContainer.classList.add('maplibregl-ctrl');
    this.controlContainer.classList.add('maplibregl-ctrl-group');
    this.mapStyleContainer = document.createElement('div');
    this.styleButton = document.createElement('button');
    this.styleButton.type = 'button';
    this.mapStyleContainer.classList.add('maplibregl-style-list');
    this.styleButton.classList.add('maplibregl-ctrl-icon');
    this.styleButton.classList.add('maplibregl-style-switcher');
    this.styleButton.addEventListener('click', () => {
      this.styleButton.style.display = 'none';
      this.mapStyleContainer.style.display = 'block';
    });
    document.addEventListener('click', this.onDocumentClick);
    this.controlContainer.appendChild(this.styleButton);
    this.controlContainer.appendChild(this.mapStyleContainer);
    return this.controlContainer;
  }

  onRemove() {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.styleButton) {
      return;
    }
    this.styleButton.removeEventListener('click', this.onDocumentClick);
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    document.removeEventListener('click', this.onDocumentClick);
    this.map = undefined;
  }

  onDocumentClick(event) {
    if (this.controlContainer && !this.controlContainer.contains(event.target) && this.mapStyleContainer && this.styleButton) {
      this.mapStyleContainer.style.display = 'none';
      this.styleButton.style.display = 'block';
    }
  }
}
