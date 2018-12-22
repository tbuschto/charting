import { View } from './View';
import { ImdbChart } from './ChartView';
import { AppStore } from './App';
import { ActionCreators } from './ActionCreators';
import { ImdbTableToChartDataConverter } from './ImdbTableToChartDataConverter';
import { ClearTableButton } from './Button';
import { DataSetSelectionList, XAxisModeList, YAxisModeList, ItemTypeList, GenreList } from './List';
import { ImdbItemFilter } from './ImdbItemFilter';
import { SelectOrRadioButton, SelectAndRadioButton, SelectXorRadioButton, AnimateCheckBox, BezierCheckBox, ReverseCheckBox } from './CheckBox';
import { Slider, YearsSlider, RatingsSlider } from './Slider';
import { Label, YearsLabel, RatingsLabel } from './Label';

export class MainView extends View<'div'> {

  constructor(
    store: AppStore,
    actions: ActionCreators,
    converter: ImdbTableToChartDataConverter,
    filter: ImdbItemFilter
  ) {
    super('div', {id: 'mainview'});
    this.append(
      new ImdbChart(store, actions, converter, filter),
      new View('div', {id: 'controls'}).append(
        new Label('Ratings:'),
        new DataSetSelectionList(store, actions),
        new View('p').append(
          new SelectOrRadioButton(store, actions),
          new SelectAndRadioButton(store, actions),
          new SelectXorRadioButton(store, actions)
        ),
        new View('p').append(
          new AnimateCheckBox(store, actions),
          new BezierCheckBox(store, actions),
          new ReverseCheckBox(store, actions)
        ),
        new Label('X-Axis:'),
        new XAxisModeList(store, actions),
        new Label('Y-Axis:'),
        new YAxisModeList(store, actions),
        new YearsLabel(store, actions),
        new YearsSlider(store, actions),
        new RatingsLabel(store, actions),
        new RatingsSlider(store, actions),
        new Label('Types:'),
        new ItemTypeList(store, actions),
        new Label('Genres:'),
        new GenreList(store, actions),
        new ClearTableButton(store, actions)
      )
    )
  }

}
