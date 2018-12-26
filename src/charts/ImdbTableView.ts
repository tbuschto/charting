import { View } from './View';
import { ImdbItem } from './ImdbTableFactory';

export class ImdbTableView extends View<'table'> {

  constructor(items: ImdbItem[], ratings: string[]) {
    super('table');
    this.append(
      new View('tr').append(
        new View('th').append('Title'),
        ...ratings.map(user => new View('th').append(user))
      ),
      ...items.map(item => new View('tr').append(
        new View('td').append(item.title),
        ...ratings.map(user => new View('td').append(
          item.ratings[user] ? item.ratings[user].toString() : '-')
        )
      ))
    );
  }

}
