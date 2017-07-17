import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

// native
import { Storage } from '@ionic/storage';

// custom
import { CommonVariableProvider } from '../common-variable/common-variable';

@Injectable()
export class MagicWandProvider {

  root_url: string;

  access_token: any;
  refresh_token: any;
  client_id: any;



  constructor(public http: Http, public storage: Storage, public commonVars: CommonVariableProvider) {
    this.root_url = commonVars.root_url;
  }

  getWithToken(url, callBack) {
    return new Promise((resolve) => {
      Observable.forkJoin([
        this.storage.get('access_token'),
        this.storage.get('refresh_token'),
        this.storage.get('client_id')
      ]).subscribe(
        data => {
          this.access_token = data[0];
          this.refresh_token = data[1];
          this.client_id = data[2];
          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.access_token});
          let options = new RequestOptions({ headers: headers });
          let total_url = this.root_url + url;
          this.http.get(total_url, options)
            .map(res => res.json())
            .subscribe(
              data => {
                callBack(data);
              },
              error => {
                if (error.status == 401 || error.status == 403){
                  let body_token = "client_id=" + this.client_id + "&grant_type=refresh_token&refresh_token=" + this.refresh_token;
                  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
                  let options = new RequestOptions({ headers: headers });
                  let total_url = this.root_url + 'api/o/token/'
                  this.http.post(total_url, body_token, options)
                    .map(res => res.json())
                    .subscribe(
                      data => {
                        // refresh token으로 갱신하면 새로운 access token 및 refresh token이 나온다.
                        this.storage.set('access_token', data.access_token).then((access_token) => {
                          this.access_token = data.access_token;
                          if (data.refresh_token) {
                            this.storage.set('refresh_token', data.refresh_token);
                            this.refresh_token = data.refresh_token;
                            // 새로 받은 access token으로 의사 리스트 받아오기.
                            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.access_token});
                            let options = new RequestOptions({ headers: headers });
                            let total_url = this.root_url + url;
                            this.http.get(total_url, options)
                              .map(res => res.json())
                              .subscribe(
                                data => {
                                  callBack(data);
                                  resolve(true);
                                },
                                error => {
                                }
                              )
                          }
                        });
                      },
                      error => {
                        console.log(error);
                      }
                    );

                } else {
                  console.log(error);
                }
              }
            );

        },
        error => {
        }

      );
    })
  }

  postWithToken() {
    return new Promise((resolve) => {

    })
  }

}
