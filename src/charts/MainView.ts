import { View } from './View';
import { ImdbChart } from './ChartView';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { ShowImdbRatingsCheckBox, ShowUserRatingsCheckBox } from './CheckBox';
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';

export class MainView extends View<'div'> {

  constructor(
    store: AppStore,
    actions: ActionCreators,
    converter: ImdbTableToChartDataConverter
  ) {
    super('div');
    this.append(
      new ImdbChart(store, actions, converter),
      new ShowImdbRatingsCheckBox(store, actions),
      new ShowUserRatingsCheckBox(store, actions)
    )
  }

}
