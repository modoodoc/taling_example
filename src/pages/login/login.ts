import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { PlaygroundPage } from '../../pages/playground/playground';

import { CommonVariableProvider } from '../../providers/common-variable/common-variable';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  root_url: string;

  client_id: any;

  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  isDisabled: boolean = false;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder,
              public storage: Storage, public http: Http, public commonVar: CommonVariableProvider,
              public toastCtrl: ToastController) {

    this.root_url = commonVar.root_url;

    this.email = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.email, ]),
    );
    this.password = new FormControl(
      '',
      Validators.compose([Validators.required, ])
    );
    this.loginForm = builder.group({
      email: this.email,
      password: this.password
    });
  }

  ionViewDidLoad() {
    this.http.get(this.root_url + 'api/client/getclientid/')
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data.client_id);
          this.storage.set('client_id', data.client_id);
          this.client_id = data.client_id;
        },
        error => {

        }
      )
  }

  login(value) {
    this.isDisabled = true;
    this.submitAttempt = true;

    if(!this.loginForm.valid){
      console.log('Form validation fail!');
      this.isDisabled = false;
    }
    console.log(value);

    // 로그인
    let body = "client_id=" + this.client_id + "&grant_type=password&username=" + value.email + "&password=" + value.password;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.root_url + 'api/o/token/', body, options)
      .map(res => res.json())
      .subscribe(
        data => {
          // storage에 access_token 및 refresh_token 을 저장하기.
          this.storage.set('access_token', data.access_token).then((access_token) => {
              this.storage.set('refresh_token', data.refresh_token).then((refresh_token) => {
                let toast = this.toastCtrl.create({
                  message: '로그인 성공!',
                  duration: 2000,
                  position: 'middle'
                })
                toast.present();

                // Doctors Page로 이동
                this.navCtrl.setRoot(PlaygroundPage);
              })
          });
        },
        error => {

        }
      )
  }

}
