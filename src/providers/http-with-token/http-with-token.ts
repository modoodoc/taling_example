import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { RegisterPage } from '../../pages/register/register';

import {CommonVariableProvider} from "../common-variable/common-variable";


@Injectable()
export class HttpWithTokenProvider {

  root_url: string;

  constructor(public http: Http, public storage: Storage, public commonVar: CommonVariableProvider) {
    this.root_url = commonVar.root_url;
  }

  getWithToken(url): Promise<any>{
    return new Promise((resolve, reject) => {
      Observable.forkJoin([
        this.storage.get('client_id'),
        this.storage.get('access_token'),
        this.storage.get('refresh_token')
      ]).subscribe(
        data => {
          let client_id = data[0];
          let access_token = data[1];
          let refresh_token = data[2];

          console.log(access_token);

          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
          let options = new RequestOptions({ headers: headers });
          let total_url = this.root_url + url;
          this.http.get(total_url, options)
            .map(res => res.json())
            .subscribe(
              data => {
                resolve(data);
              },
              error => {
                console.log(error.status);
                if (error.status == 401 || error.status == 403){
                  let body_token = "client_id=" + client_id + "&grant_type=refresh_token&refresh_token=" + refresh_token;
                  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
                  let options = new RequestOptions({ headers: headers });
                  let total_url = this.root_url + 'api/o/token/';
                  this.http.post(total_url, body_token, options)
                    .map(res => res.json())
                    .subscribe(
                      data => {
                        // refresh token으로 갱신하면 새로운 access token 및 refresh token이 나온다.
                        this.storage.set('access_token', data.access_token).then((access_token) => {
                            this.storage.set('refresh_token', data.refresh_token);
                            // 새로 받은 access token으로 의사 리스트 받아오기.
                            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
                            let options = new RequestOptions({ headers: headers });
                            let total_url = this.root_url + url;
                            this.http.get(total_url, options)
                              .map(res => res.json())
                              .subscribe(
                                data => {
                                  resolve(data);
                                },
                                error => {
                                  reject(error);
                                }
                              )
                        });
                      },
                      error => {
                        console.log(error);
                        reject(error);
                      }
                    );

                } else {
                  console.log(error);
                  reject(error);
                }
              }
            )

        },
        error => {
          console.log(error);
          reject(error);
        }
      )
    })
  }

  postWithToken(url, body): Promise<any> {
    return new Promise((resolve, reject) => {
      Observable.forkJoin([
        this.storage.get('client_id'),
        this.storage.get('access_token'),
        this.storage.get('refresh_token')
      ]).subscribe(
        data => {
          let client_id = data[0];
          let access_token = data[1];
          let refresh_token = data[2];

          // api post request.
          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
          let options = new RequestOptions({ headers: headers });
          let total_url = this.root_url + url;
          this.http.post(total_url, body, options)
            .map(res => res.json())
            .subscribe(
              data => {
                resolve(data);
              },
              error => {
                if (error.status == 401 || error.status == 403){
                  let body_token = "client_id=" + client_id + "&grant_type=refresh_token&refresh_token=" + refresh_token;
                  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
                  let options = new RequestOptions({ headers: headers });
                  let total_url = this.root_url + 'api/o/token/';
                  this.http.post(total_url, body_token, options)
                    .map(res => res.json())
                    .subscribe(
                      data => {
                        // refresh token으로 갱신하면 새로운 access token 및 refresh token이 나온다.
                        this.storage.set('access_token', data.access_token).then((access_token) => {
                          this.storage.set('refresh_token', data.refresh_token);
                          // 새로 받은 access token으로 의사 리스트 받아오기.
                          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
                          let options = new RequestOptions({ headers: headers });
                          let total_url = this.root_url + url;
                          this.http.post(total_url, body, options)
                            .map(res => res.json())
                            .subscribe(
                              data => {
                                resolve(data);
                              },
                              error => {
                                reject(error);
                              }
                            )
                        });
                      },
                      error => {
                        console.log(error);
                        reject(error);
                      }
                    )
                } else {
                  console.log(error);
                  reject(error);
                }
              }
            )
        },
        error => {
          console.log(error);
          reject(error);
        }
      )
    });
  }

  putWithtoken(url, body): Promise<any>{
    return new Promise((resolve, reject) => {
      Observable.forkJoin([
        this.storage.get('client_id'),
        this.storage.get('access_token'),
        this.storage.get('refresh_token')
      ]).subscribe(
        data => {
          let client_id = data[0];
          let access_token = data[1];
          let refresh_token = data[2];

          // api post request.
          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
          let options = new RequestOptions({ headers: headers });
          let total_url = this.root_url + url;
          this.http.put(total_url, body, options)
            .map(res => res.json())
            .subscribe(
              data => {
                resolve(data);
              },
              error => {
                if (error.status == 401 || error.status == 403){
                  let body_token = "client_id=" + client_id + "&grant_type=refresh_token&refresh_token=" + refresh_token;
                  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
                  let options = new RequestOptions({ headers: headers });
                  let total_url = this.root_url + 'api/o/token/';
                  this.http.post(total_url, body_token, options)
                    .map(res => res.json())
                    .subscribe(
                      data => {
                        // refresh token으로 갱신하면 새로운 access token 및 refresh token이 나온다.
                        this.storage.set('access_token', data.access_token).then((access_token) => {
                          this.storage.set('refresh_token', data.refresh_token);
                          // 새로 받은 access token으로 의사 리스트 받아오기.
                          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
                          let options = new RequestOptions({ headers: headers });
                          let total_url = this.root_url + url;
                          this.http.put(total_url, body, options)
                            .map(res => res.json())
                            .subscribe(
                              data => {
                                resolve(data);
                              },
                              error => {
                                reject(error);
                              }
                            )
                        });
                      },
                      error => {
                        console.log(error);
                        reject(error);
                      }
                    )
                } else {
                  console.log(error);
                  reject(error);
                }
              }
            )
        },
        error => {
          console.log(error);
          reject(error);
        }
      )
    });
  }

  deleteWithToken(url, body): Promise<any>{
    return new Promise((resolve, reject) => {
      Observable.forkJoin([
        this.storage.get('client_id'),
        this.storage.get('access_token'),
        this.storage.get('refresh_token')
      ]).subscribe(
        data => {
          let client_id = data[0];
          let access_token = data[1];
          let refresh_token = data[2];

          // api post request.
          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
          let options = new RequestOptions({ headers: headers });
          let total_url = this.root_url + url;
          this.http.delete(total_url, options)
            .map(res => res.json())
            .subscribe(
              data => {
                resolve(data);
              },
              error => {
                if (error.status == 401 || error.status == 403){
                  let body_token = "client_id=" + client_id + "&grant_type=refresh_token&refresh_token=" + refresh_token;
                  let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
                  let options = new RequestOptions({ headers: headers });
                  let total_url = this.root_url + 'api/o/token/';
                  this.http.post(total_url, body_token, options)
                    .map(res => res.json())
                    .subscribe(
                      data => {
                        // refresh token으로 갱신하면 새로운 access token 및 refresh token이 나온다.
                        this.storage.set('access_token', data.access_token).then((access_token) => {
                          this.storage.set('refresh_token', data.refresh_token);
                          // 새로 받은 access token으로 의사 리스트 받아오기.
                          let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token});
                          let options = new RequestOptions({ headers: headers });
                          let total_url = this.root_url + url;
                          this.http.delete(total_url, options)
                            .map(res => res.json())
                            .subscribe(
                              data => {
                                resolve(data);
                              },
                              error => {
                                reject(error);
                              }
                            )
                        });
                      },
                      error => {
                        console.log(error);
                        reject(error);
                      }
                    )
                } else {
                  console.log(error);
                  reject(error);
                }
              }
            )
        },
        error => {
          console.log(error);
          reject(error);
        }
      )
    });
  }

}
