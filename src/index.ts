import { createStore, applyMiddleware } from 'redux';
import { App, AppStore, AppState } from './charts/App';
import { Reducer } from './charts/Reducer';
import { ImdbTableFilePicker } from './charts/FilePicker';
import { ImdbTableFactory } from './charts/ImdbTableFactory';
import { ActionCreators } from './charts/ActionCreators';
import { createLogger } from 'redux-logger';
import { MainView } from './charts/MainView';
import { Persistence } from './charts/Persistence';
import { ImdbTableToChartDataConverter, YEAR_MIN, YEAR_MAX } from './charts/ImdbTableToChartDataConverter';
import * as freeze from 'redux-freeze';
import reduxThunk from 'redux-thunk';
import { ImdbItemFilter } from './charts/ImdbItemFilter';

(async () => {

  console.info('Init REDUX Store...');

  const defaultState: AppState = {
    xAxis: 'Years',
    yAxis: 'Distribution',
    users: [],
    userLogic: 'OR',
    imdbTable: {},
    genres: {},
    reverse: false,
    animate: true,
    bezier: true,
    years: [YEAR_MIN, YEAR_MAX],
    ratings: [1, 10],
    itemTypes: {
      movie: true,
      tvMiniSeries: false,
      tvMovie: false,
      tvSeries: false,
      video: false,
      videoGame: false
    }
  };

  const store: AppStore = createStore(
    new Reducer().chartsApp,
    Persistence.readState(defaultState),
    applyMiddleware(
      freeze as any, // broken type declaration of freeze
      reduxThunk,
      createLogger({})
    )
  ) as AppStore;

  new Persistence(store);

  const actions = new ActionCreators(
    new ImdbTableFactory()
  );

  console.info('App Start...');

  await new App(
    document.body,
    store,
    new ImdbTableFilePicker(store, actions),
    new MainView(
      store,
      actions,
      new ImdbTableToChartDataConverter(),
      new ImdbItemFilter()
    )
  ).start();

  console.info('DONE');

})();

