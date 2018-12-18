import { AppState } from './App';
import { ImdbItem } from './ImdbTableFactory';

export class ImdbTableToChartDataConverter {

  public convert(state: AppState): Chart.ChartDataSets[] {
    const table = state.imdbTable;
    if (!Object.keys(table).length) {
      return [];
    }
    const items = Object.keys(table).map(id => table[id]);
    const result: Chart.ChartDataSets[] = [];
    state.users.forEach((user, i) => {
      if (user.show) {
        result.push(this.getRatings(items, user.name, user.color, i * 0.2));
      }
    })
    return result;
  }

  private getRatings(
    items: ImdbItem[],
    rating: string,
    color: string,
    offset: number
  ): Chart.ChartDataSets {
    return {
      label: rating,
      backgroundColor: color,
      borderColor: color,
      pointHoverBorderColor: 'white',
      pointRadius: 4,
      data: items.filter(item => rating in item.ratings).map<Chart.ChartPoint>(item => ({
        label: `${item.title}: ${item.ratings[rating]}`,
        x: yearOf(item.release) + offset,
        y: Math.min(item.ratings[rating], 9.99)
      }))
    };
  }

  private groupByYear(items: ImdbItem[]): {[key: string]: ImdbItem[]} {
    const years: {[key: string]: ImdbItem[]} = {};
    items.forEach(item => {
      const year = yearOf(item.release);
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(item);
    });
    return years;
  }

}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}
