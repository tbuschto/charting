import { View } from './View';
import { ImdbChart } from './ChartView';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { ShowImdbRatingsCheckBox, ShowUserRatingsCheckBox } from './CheckBox';
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';
import { ClearTableButton } from './Button';

export class MainView extends View<'div'> {

  constructor(
    store: AppStore,
    actions: ActionCreators,
    converter: ImdbTableToChartDataConverter
  ) {
    super('div', {id: 'mainview'});
    this.append(
      new ImdbChart(store, actions, converter),
      new View('div', {id: 'controls'}).append(
        new ShowImdbRatingsCheckBox(store, actions),
        new ShowUserRatingsCheckBox(store, actions),
        new ClearTableButton(store, actions)
      )
    )
  }

}
