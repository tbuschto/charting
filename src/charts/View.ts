export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {

  public readonly element: HTMLElementTagNameMap[T];

  constructor(
    tagName: T,
    attributes: Partial<HTMLElementTagNameMap[T]> = {},
    styles: Partial<CSSStyleDeclaration> = {}
  ) {
    this.element = document.createElement(tagName);
    Object.assign(this.element, attributes);
    Object.assign(this.element.style, styles);
  }

}