import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {

  constructor(public storage: Storage) {

  }

  getData(): Promise<any> {
    return this.storage.get('pictures');
  }

  save(data): void {
    let newData = JSON.stringify(data);
    this.storage.set('pictures', newData);

    console.log(data);

  }
}
