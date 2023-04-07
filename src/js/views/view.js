import icons from 'url:../../img/icons.svg';

export default class view {
  _data;

  /**
   * render the recived object to dom
   * @param {object| object[]} data the data to be rendered
   * @param {boolean} [render=true] if false create markup string
   * @returns {undefined|string} A markup string is returned if render=false
   * @this view instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    // console.log(data);
    const markup = this._generateMarkup();
    // console.log(markup);

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;

    // console.log(data);
    // console.log(data);
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements, curElements);

    // console.log(curElements);
    newElements.forEach((newel, i) => {
      const curEl = curElements[i];
      // if (!curEl) {
      //   console.log(curEl);
      // }
      //UPDATES CHANGED TEXT
      if (
        !newel.isEqualNode(curEl) &&
        newel.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(curEl);
        // console.log('@', newel.firstChild.nodeValue.trim());
        curEl.textContent = newel.textContent;
      }

      //UPDATE CHANGED ATTRIBUTE

      if (!newel.isEqualNode(curEl)) {
        // console.log(Array.from(newel.attributes));
        Array.from(newel.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    // console.log(parentElement);
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
