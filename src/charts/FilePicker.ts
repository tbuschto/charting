import { AppStore } from './App'
import { View } from './View'
import { ActionCreators } from './ActionCreators';

export class FilePicker extends View<"input"> {

  public onFilePicked: (content: string) => void;

  constructor() {
    super('input', {type: 'file'});
    this.element.addEventListener('change', () => this.handleInputValueChanged());
  }

  private async handleInputValueChanged() {
    if (this.onFilePicked) {
      this.onFilePicked(await this.blobToString(this.element.files[0]))
    }
  }

  private async blobToString(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.addEventListener('loadend', () => resolve(reader.result as string));
    });
  }

}

export class ImdbTableFilePicker extends FilePicker {

  constructor(
    store: AppStore,
    actions: ActionCreators
  ) {
    super();
    this.onFilePicked = content => {
      store.dispatch(actions.addTableData(content))
    }
  }

}