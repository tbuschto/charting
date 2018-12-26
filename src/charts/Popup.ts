import { View } from './View';
import { from } from 'rxjs';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { ImdbTableView } from './ImdbTableView';
import Button from './Button';

export class Popup extends View<'div'> {

  public onDismiss = this.registerEvent<() => any>();

  private _popup: View<'div'> = new View('div', {id: 'popup'});
  private _contentWrapper: View<'div'> = new View('div', {id: 'wrapper'});
  private _content: View;

  constructor() {
    super('div', {id: 'overlay'});
    this.append(this._popup);
    this._popup.append(this._contentWrapper);
    const button = new Button('OK');
    button.onClick(() =>
      this.emit(this.onDismiss)
    );
    this._popup.append(button);
    this.element.addEventListener('click', ev => {
      this.emit(this.onDismiss);
    });
  }

  public set content(value: View) {
    if (this._content !== value) {
      if (this._content) {
        this._content.element.remove();
        this._content = null;
      }
      if (value) {
        this._content = value;
        this._contentWrapper.append(this._content)
      }
    }
  }

  public get content() {
    return this._content;
  }

  public set visible(value: boolean) {
    if (value && !this.visible) {
      document.body.append(this.element);
    } else {
      this.element.remove();
    }
  }

  public get visible() {
    return this.element.parentElement === document.body;
  }

}

export class TablePopup extends Popup {

  constructor(
    store: AppStore,
    actions: ActionCreators
  ) {
    super()
    from(store).pipe(distinctUntilKeyChanged('tableView')).subscribe(({tableView, users}) => {
      if (tableView && tableView.length) {
        this.visible = true;
        this.content = new ImdbTableView(
          tableView,
          users.filter(user => user.show).map(user => user.name)
        );
      } else {
        this.visible = false;
      }
    });
    this.onDismiss(() => {
      store.dispatch(actions.setTableViewItems(null));
    });
  }

}
