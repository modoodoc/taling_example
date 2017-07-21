import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonVariableProvider {

  root_url: string;

  constructor(public http: Http) {
    // http://127.0.0.1:8000/
    this.root_url = 'https://fathomless-garden-38295.herokuapp.com/';
  }

}
