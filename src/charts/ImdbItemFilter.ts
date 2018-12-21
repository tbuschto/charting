import { ImdbItem } from './ImdbTableFactory';
import { AppState } from './App';

export class ImdbItemFilter {

  filter(items: ImdbItem[], state: AppState): ImdbItem[] {
    return items.filter(item => state.itemTypes[item.type]);
  }

}