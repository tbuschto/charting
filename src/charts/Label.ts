import { View } from './View';
import { ActionCreators } from './ActionCreators';
import { from } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { AppStore } from './App';

export class Label extends View<'p'> {

  constructor(text: string) {
    super('p');
    this.text = text;
  }

  public set text(value: string) {
    this.element.innerText = value;
  }

  public get text() {
    return this.element.innerText;
  }

}

export class YearsLabel extends Label {
  constructor(store: AppStore, actions: ActionCreators) {
    super('');
    from(store).pipe(distinctUntilKeyChanged('years')).subscribe(({years}) => {
      this.text = `Years: ${years[0]} - ${years[1]}`
    });
  }
}

export class RatingsLabel extends Label {
  constructor(store: AppStore, actions: ActionCreators) {
    super('');
    from(store).pipe(distinctUntilKeyChanged('ratings')).subscribe(({ratings}) => {
      this.text = `Ratings: ${ratings[0]} - ${ratings[1]}`
    });
  }
}
