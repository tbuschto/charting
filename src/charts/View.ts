import { EventEmitter } from 'typed-event-emitter';

export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>
  extends EventEmitter
{


  public readonly element: HTMLElementTagNameMap[T];
  public onClick = this.registerEvent();

  constructor(
    tagName: T,
    attributes: Partial<HTMLElementTagNameMap[T]> = {},
    styles: Partial<CSSStyleDeclaration> = {}
  ) {
    super();
    this.element = document.createElement(tagName);
    this.element.onclick = () => this.emit(this.onClick);
    Object.assign(this.element, attributes);
    Object.assign(this.element.style, styles);
  }

  public append(...content: Array<View|string>): this {
    content.forEach(child => this.element.appendChild(
      typeof child === 'string' ? document.createTextNode(child) : child.element
    ));
    return this;
  }

}
