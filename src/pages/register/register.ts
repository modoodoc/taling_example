import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { LoginPage } from '../../pages/login/login';
import { PlaygroundPage } from '../../pages/playground/playground';

import { CommonVariableProvider } from '../../providers/common-variable/common-variable';

interface ValidationResult {

}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  root_url: string;

  client_id: string;

  registerForm: FormGroup;
  email: FormControl;
  nickname: FormControl;
  password: FormControl;

  isDisabled: boolean = false;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder,
              public alertCtrl: AlertController, public http: Http, public storage: Storage,
              public commonVar: CommonVariableProvider) {

    this.root_url = commonVar.root_url;

    this.email = new FormControl(
      '',
      Validators.compose([Validators.required, ]),
      this.emailCheck.bind(this)
    );
    this.nickname = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(6)]),
      // this.nicknameCheck.bind(this)
    );
    this.password = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(8)])
    );
    this.registerForm = builder.group({
      email: this.email,
      nickname: this.nickname,
      password: this.password
    });
  }

  ionViewDidLoad() {

  }

  openLoginPage(event) {
    event.preventDefault();

    this.navCtrl.setRoot(LoginPage);
  }

  emailCheck(control: FormControl): Observable<ValidationResult> {
    return new Observable((obs) => {
      control
        .valueChanges
        .debounceTime(1500)
        .distinctUntilChanged()
        .flatMap(value => {
          console.log(value);
          let body = 'email=' + value;
          let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
          let options = new RequestOptions({headers: headers});
          return this.http.post(this.root_url + 'api/client/emailcheck/', body, options)
        })
        .map(res => res.json())
        .subscribe(
          data => {
            console.log('yes');
            console.log(data);
            obs.next(null);
            obs.complete();
          },
          error => {
            console.log('no');
            console.log(error);
            console.log(error._body);
            console.log(JSON.parse(error._body));
            console.log(JSON.parse(error._body).email);
            if (JSON.parse(error._body).email == '이미 등록된 메일입니다.'){
              obs.next({'emailTaken': true});
              obs.complete();
            } else if(JSON.parse(error._body).email == '유효한 이메일 주소를 입력하십시오.'){
              obs.next({'wrongEmail': true});
              obs.complete();
            }
            obs.next(null);
            obs.complete();
          }
        )

    });
  }

  nicknameCheck(control: FormControl): Observable<ValidationResult> {
    return new Observable((obs) => {
      control
        .valueChanges
        .debounceTime(1500)
        .flatMap(value => {
          let body = 'nickname=' + value;
          let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
          let options = new RequestOptions({headers: headers});
          return this.http.post(this.root_url + 'api/client/nicknamecheck/', body, options)
        })
        .map(res => res.json())
        .subscribe(
          data => {
            console.log(data);
            obs.next(null);
            obs.complete();
          },
          error => {
            console.log(error);
            obs.next({'nicknameTaken': true});
          }
        )
    });
  }

  register(value) {

    this.submitAttempt = true;
    this.isDisabled = true;

    if(!this.registerForm.valid){
      console.log('validation error!');
      this.isDisabled = false;
      return;
    }
    console.log('validation success!');

    let body = JSON.stringify({'email': value.email, 'password': value.password, 'nickname': value.nickname});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.root_url + 'api/client/registration/', body, options)
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data);
          this.client_id = data.client_id;
          this.storage.set('client_id', data.client_id).then(
            data => {
              let body = "client_id=" + this.client_id + "&grant_type=password&username=" + value.email + "&password=" + value.password;
              let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
              let options = new RequestOptions({ headers: headers });
              this.http.post(this.root_url + 'api/o/token/', body, options)
                .map(res => res.json())
                .subscribe(
                  data => {
                    console.log("토큰 발행 성공!");
                    // sqlstorage에 access_token 및 refresh_token 을 저장하고 Doctors page로 이동.
                    this.storage.set('access_token', data.access_token).then((access_token) => {
                      if(access_token) {
                        this.storage.set('refresh_token', data.refresh_token).then((refresh_token) => {
                          if(refresh_token) {

                            // 회원가입 성공함을 알려줌.
                            let alert = this.alertCtrl.create({
                              title: "회원가입 성공",
                              subTitle: "회원가입 및 로그인 완료하였습니다.",
                              buttons: ['확인']
                            });
                            alert.present();

                            // Doctors Page로 이동
                            this.navCtrl.setRoot(PlaygroundPage);
                          }
                        });
                      }
                    });
                  },
                  error => {
                    console.log(error);
                  }
                )
            },
            error => {
              console.log(error);
            }
          );

        },
        error => {
          console.log(error);
        }
      )
  }

}
