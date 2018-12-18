import { AppStore } from './App'
import { View } from './View'
import { ActionCreators } from './ActionCreators';

export type TextFile = {name: string, content: string};

export class FilePicker extends View<'input'> {

  public onFilesPicked = this.registerEvent<(files: TextFile[]) => any>();

  constructor() {
    super('input', {type: 'file', multiple: true});
    this.element.addEventListener('change', () => this.handleInputValueChanged());
  }

  private async handleInputValueChanged() {
    const textFiles: TextFile[] = [];
    const files = this.element.files;
    for (let i = 0; i < files.length; i++) {
      textFiles[i] = {
        name: files[i].name,
        content: await this.blobToString(files[i])
      };
    }
    this.emit(this.onFilesPicked, textFiles);
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
  constructor(store: AppStore, actions: ActionCreators) {
    super();
    this.onFilesPicked(content => store.dispatch(actions.addFiles(content)));
  }
}
