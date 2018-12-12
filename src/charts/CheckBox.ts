import { View } from './View';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';

export class CheckBox extends View<'div'> {

  public onCheckedChanged = this.registerEvent<(checked: boolean) => any>();

  private _input: View<'input'>;

  constructor(label: string) {
    super('div');
    this._input = new View('input', {type: 'checkbox'});
    this.append(this._input, label);
    this._input.element.addEventListener('change',
      () => this.emit(this.onCheckedChanged, this.checked)
    );
  }

  public set checked(value: boolean) {
    this._input.element.checked = value;
  }

  public get checked() {
    return this._input.element.checked;
  }

}

export class ShowUserRatingsCheckBox extends CheckBox {
  constructor(store: AppStore, actions: ActionCreators) {
    super('Show User Ratings');
    from(store).pipe(distinctUntilKeyChanged('showUserRatings')).subscribe(state => {
      this.checked = state.showUserRatings;
    });
    this.onCheckedChanged(checked => {
      store.dispatch(actions.showUserRatings(checked))
    });
  }
}

export class ShowImdbRatingsCheckBox extends CheckBox {
  constructor(store: AppStore, actions: ActionCreators) {
    super('Show Imdb Ratings');
    from(store).pipe(distinctUntilKeyChanged('showImdbRatings')).subscribe(state => {
      this.checked = state.showImdbRatings;
    });
    this.onCheckedChanged(checked => {
      store.dispatch(actions.showImdbRatings(checked))
    });
  }
}