import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { LoginPage } from '../../pages/login/login';

interface ValidationResult {

}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  root_url: string;

  registerForm: FormGroup;
  email: FormControl;
  nickname: FormControl;
  password: FormControl;

  isDisabled: boolean = false;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder,
              public http: Http) {

    this.root_url = 'https://fathomless-garden-38295.herokuapp.com/';

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

    this.navCtrl.push(LoginPage);
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

    if(!this.registerForm.valid){
      console.log('validation error!');
      return;
    }
    console.log('validation success!');

    let body = JSON.stringify({'email': value.email, 'password': value.password, 'nickname': value.nickname});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.root_url + 'api/client/registration/', body, options)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
  }

}
