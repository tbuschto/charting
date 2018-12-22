import { AppState, User, YAxisMode } from './App';
import { ImdbItem } from './ImdbTableFactory';

type Category = {name: string, items: ImdbItem[]};
type Categories = Category[];

export const YEAR_MIN = 1920;
export const YEAR_MAX = 2020;

export class ImdbTableToChartDataConverter {

  public convert(items: ImdbItem[], state: AppState): Chart.ChartData {
    const result: Chart.ChartData = {datasets: [], labels: []};
    const users = state.reverse ? state.users.concat().reverse() : state.users;
    users.forEach(user => {
      if (user.show) {
        const categories = this.groupByCategory(items, user, state);
        result.datasets.push(this.getDataSet(categories, user, state, items));
        result.labels = categories.map(cat => cat.name);
      }
    })
    return result;
  }

  private getDataSet(categories: Categories, user: User, state: AppState, items: ImdbItem[]): Chart.ChartDataSets {
    if (state.yAxis === 'Distribution') {
      return this.getAllRatings(categories, user, state);
    }
    if (state.yAxis === 'Count') {
      return this.getTitleCount(categories, user, state);
    }
    if (state.yAxis === 'Percent') {
      return this.getTitlesPercent(categories, user, state, items);
    }
    return this.getAccumulatedRatings(categories, user, state);
  }

  private getAllRatings(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    const data: Chart.ChartPoint[] = [];
    const xAxis = state.xAxis;
    categories.forEach((cat, i) => {
      this.groupByRating(cat.items, user.name).forEach(rating => {
        if (!rating.items.length) {
          return;
        }
        data.push({
          label: this.getLabel(cat.name, rating.items),
          message: this.getMessage(cat.name, rating.items),
          x: i,
          y: parseInt(rating.name),
          r: Math.round(rating.items.length / (xAxis === 'Decades' ? 8 : 2)) + 3
        });
      });
    });
    return {
      label: user.name,
      backgroundColor: `rgb(${user.color.join(', ')}, 0.5)`,
      borderColor: `rgb(${user.color.join(', ')})`,
      hoverRadius: 0,
      hoverBorderColor: 'white',
      data
    };
  }

  private getAccumulatedRatings(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    const fallback = state.xAxis === 'Decades' ? 0 : undefined;
    const data: number[] = categories.map(cat =>
      roundTo(this.acc(itemsToRatings(cat.items, user), state.yAxis, fallback), 2)
    );
    const rgb = `rgb(${user.color.join(', ')})`;
    return {
      label: user.name,
      backgroundColor: state.xAxis === 'Years' ? 'transparent' : rgb,
      borderColor: rgb,
      hoverBorderColor: 'white',
      lineTension: state.bezier ? 0.33 : 0,
      data
    };
  }

  private getTitleCount(categories: Categories, user: User, state: AppState): Chart.ChartDataSets {
    const rgb = `rgb(${user.color.join(', ')})`;
    return {
      label: user.name,
      backgroundColor: state.xAxis === 'Years' ? 'transparent' : rgb,
      borderColor: rgb,
      hoverBorderColor: 'white',
      lineTension: state.bezier ? 0.33 : 0,
      data: categories.map(cat => itemsToRatings(cat.items, user).length)
    };
  }

  private getTitlesPercent(
    categories: Categories,
    user: User,
    state: AppState,
    items: ImdbItem[]
  ): Chart.ChartDataSets {
    const rgb = `rgb(${user.color.join(', ')})`;
    let factor = 100 / itemsToRatings(items, user).length;
    if (!isFinite(factor)) {
      factor = 0;
    }
    return {
      label: user.name,
      backgroundColor: state.xAxis === 'Years' ? 'transparent' : rgb,
      borderColor: rgb,
      hoverBorderColor: 'white',
      lineTension: state.bezier ? 0.33 : 0,
      data: categories.map(cat => roundTo(factor * itemsToRatings(cat.items, user).length, 2))
    };
  }

  private acc(ratings: number[], mode: YAxisMode, fallback: any): number {
    if (!ratings.length) {
      return fallback;
    }
    if (mode === 'Average') {
      return ratings.reduce((prev, curr) => prev + (curr || 0)) / ratings.length
    }
    if (mode === 'Median') {
      return ratings.sort()[Math.floor(ratings.length / 2)];
    }
    if (mode === 'RT') {
      return (10 / ratings.length) * ratings.filter(i => i >= 7).length;
    }
    throw new Error('acc does not support mode ' + mode);
  }

  private getLabel(category: string, items: ImdbItem[]): string {
    const titles: string[] = items.map(item => item.title);
    const max = 3;
    const result: Array<string|number> = [category, ': '];
    if (titles.length <= max) {
      result.push(titles.join(', '));
    } else {
      result.push(titles.slice(0, max).join(', '));
      result.push(' and ', titles.length - max, ' more...');
    }
    return result.join('');
  }

  private getMessage(category: string, items: ImdbItem[]): string {
    return items.map(item => item.title).join('\n');
  }

  private groupByCategory(items: ImdbItem[], user: User, state: AppState): Categories {
    if (state.xAxis ===  'Rating') {
      return this.groupByRating(items, user.name);
    }
    if (state.xAxis === 'Decades') {
      return this.groupByDecade(items, state.yAxis);
    }
    return this.groupByYear(items, state);
  }

  private groupByYear(items: ImdbItem[], state: AppState): Categories {
    const unsort: {[year: number]: ImdbItem[]} = {};
    items.forEach(item => {
      const year = yearOf(item.release);
      if (isNaN(year)) {
        console.warn(`No release year for ${item.title}`);
        return;
      }
      const items = unsort[year] = unsort[year] || []
      items.push(item);
    });
    const result: Categories = [];
    const [yearMin, yearMax] = state.years;
    for (let i = yearMin; i <= yearMax; i++) {
      result[i - yearMin] = {name: i + '', items: unsort[i] || []};
    }
    return result;
  }

  private groupByDecade(items: ImdbItem[], yAxis: YAxisMode): Categories {
    const unsort: {[decade: number]: ImdbItem[]} = {};
    items.forEach(item => {
      const decade = decadeOf(item.release);
      if (isNaN(decade)) {
        console.warn(`No release decade for ${item.title}`);
        return;
      }
      const items = unsort[decade] = unsort[decade] || []
      items.push(item);
    });
    const result: Categories = [];
    for (let i = YEAR_MIN; i < YEAR_MAX; i += 10) {
      result.push({name: i + 's', items: unsort[i] || []});
    }
    if (yAxis === 'Distribution') {
      result.push({name: '', items: []});
      result.unshift({name: '', items: []});
    }
    return result;
  }

  private groupByRating(items: ImdbItem[], ratingName: string): Categories {
    const result: Categories = [];
    for (let i = 1; i <= 10; i++) {
      result.push({name: i + '', items: []});
    }
    items.forEach(item => {
      if (ratingName in item.ratings) {
        const rating = Math.round(item.ratings[ratingName]);
        result[rating - 1].items.push(item);
      }
    });
    return result;
  }

}

function decadeOf(date: string): number {
  return Math.floor(yearOf(date) / 10) * 10;
}

function yearOf(date: string): number {
  return new Date(date).getFullYear()
}

function roundTo(value: number, points: number) {
  if (typeof value !== 'number') {
    return undefined;
  }
  const factor = Math.pow(10, points);
  return Math.round(value * factor) / factor;
}

function itemsToRatings(items: ImdbItem[], user: User): number[] {
  return items.filter(item => user.name in item.ratings).map(item => item.ratings[user.name]);
}
