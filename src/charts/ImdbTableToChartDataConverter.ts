import { AppState, Color, XAxisMode, User } from './App';
import { ImdbItem } from './ImdbTableFactory';
import { ChartDataSets } from 'chart.js';

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
        const categories = this.groupByCategory(state.xAxis, items);
        result.push(this.getRatings(categories, user, state.xAxis));
      }
    })
    return result;
  }

  private getRatings(
    categories: {[key: string]: ImdbItem[]},
    user: User,
    xAxis: XAxisMode
  ): Chart.ChartDataSets {
    const data: Chart.ChartPoint[] = [];
    for (let cat in categories) {
      const ratings = this.groupByRating(categories[cat], user.name);
      for(let rating in ratings) {
        data.push({
          label: this.getLabel(cat, rating, ratings[rating]),
          x: parseInt(cat),
          y: parseInt(rating),
          r: Math.round(ratings[rating].length / (xAxis === 'Decades' ? 10 : 1)) + 3
        } as Chart.ChartPoint);
      }
    }
    return {
      label: user.name,
      backgroundColor: `rgb(${user.color.join(', ')}, 0.5)`,
      borderColor: `rgb(${user.color.join(', ')})`,
      hoverRadius: 0,
      hoverBorderColor: 'white',
      data
    } as ChartDataSets; // casting needed due to broken type declarations
  }

  private getLabel(cat: string, rating: string, items: ImdbItem[]): string {
    const titles: string[] = items.map(item => item.title);
    const max = 5;
    const result: Array<string|number> = [];
    if (titles.length <= max) {
      result.push(titles.join(', '));
    } else {
      result.push(titles.slice(0, max).join(', '));
      result.push(' and ', titles.length - max, ' more...');
    }
    return result.join('');
  }

  private groupByCategory(
    xAxis: XAxisMode,
    items: ImdbItem[]
  ): {[key: string]: ImdbItem[]} {
    const categories: {[key: string]: ImdbItem[]} = {};
    items.forEach(item => {
      const year = yearOf(item.release);
      const category = xAxis === 'Decades' ? (Math.floor(year / 10) * 10) + 5 : year;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  }

  private groupByRating(items: ImdbItem[], ratingName: string): {[key: string]: ImdbItem[]} {
    const ratings: {[key: string]: ImdbItem[]} = {};
    items.forEach(item => {
      const rating = Math.round(item.ratings[ratingName]);
      if (!ratings[rating]) {
        ratings[rating] = [];
      }
      ratings[rating].push(item);
    });
    return ratings;
  }

}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}
