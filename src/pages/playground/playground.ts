import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { RegisterPage } from '../../pages/register/register';
import { LoginPage } from '../../pages/login/login';
import { CommentPage } from '../../pages/comment/comment';

import { HttpWithTokenProvider } from '../../providers/http-with-token/http-with-token';

@IonicPage()
@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html',
})
export class PlaygroundPage {

  email: string;

  posts: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public storage: Storage,
              public httpWithToken: HttpWithTokenProvider, public alertCtrl: AlertController, public loading: LoadingController,
              public menu: MenuController) {

    // 로그인 상태인지 확인하고 그에 따라 메뉴를 렌더링.
    this.menu.enable(false);
    this.storage.get('access_token').then((access_token) => {
      if (access_token === null) {
        this.menu.enable(true, 'unauthenticated');
      } else {
        this.httpWithToken.getWithToken('api/client/logincheck/').then(
          data => {
            console.log(data);
            this.menu.enable(true, 'authenticated');
          },
          error => {
            console.log(error);
            this.menu.enable(true, 'unauthenticated');
          }
        )

      }
    });

    // 사용자의 이메일을 갖고오기.
    this.httpWithToken.getWithToken('api/client/getemail/').then(
      data => {
        console.log(data);
        this.email = data.email;
      },
      error => {
        console.log(error);
      }
    )

  }

  ionViewDidLoad() {

    let loading = this.loading.create({
      content : ''
    });
    loading.present();

    // 글 내역을 가지고 와서 출력하기.
    this.httpWithToken.getWithToken('api/comments/').then(
      data => {
        console.log(data);
        this.posts = data;
        loading.dismiss();
      },
      error => {
        console.log(error);
      }
    );
  }

  callBackFromCommentPage() {
    return new Promise((resolve, reject) => {
      console.log('callBack yo!');

      // 글 내역을 새로 가지고 와서 출력하기.
      this.httpWithToken.getWithToken('api/comments/').then(
        data => {
          console.log(data);
          this.posts = data;
          resolve();
        },
        error => {
          console.log(error);
          reject();
        }
      );
    })
  }

  addComment() {
    this.httpWithToken.getWithToken('api/client/logincheck/').then(
      // 로그인된 경우
      data => {
        this.navCtrl.push(CommentPage, {
          callBack: this.callBackFromCommentPage.bind(this)
        });
      },
      // 로그인 안된 경우.
      error => {
        let confirm = this.alertCtrl.create({
          title: '로그인을 하셔야 이용가능합니다.',
          message: '로그인 페이지로 이동하시겠습니까?',
          buttons: [
            {
              text: '취소',
              handler: () => {

              }
            },
            {
              text: '확인',
              handler: () => {
                let newTransition = confirm.dismiss();

                newTransition.then(() => {
                  this.navCtrl.setRoot(LoginPage);
                });

                return false;
              }
            }
          ]
        });
        confirm.present();
      }
    );
  }

  update(item, post) {
    console.log(post);

    item.close();

    this.navCtrl.push(CommentPage, {post: post})
  }

  returnToRegisterPage() {
    Observable.forkJoin([
      this.storage.remove('access_token'),
      this.storage.remove('refresh_token'),
      this.storage.remove('client_id')
    ]).subscribe(
      data => {
        let confirm = this.alertCtrl.create({
          title: '로그인을 하셔야 이용가능합니다.',
          message: '로그인 페이지로 이동하시겠습니까?',
          buttons: [
            {
              text: '취소',
              handler: () => {

              }
            },
            {
              text: '확인',
              handler: () => {
                let newTransition = confirm.dismiss();

                newTransition.then(() => {
                  this.navCtrl.setRoot(RegisterPage);
                });

                return false;
              }
            }
          ]
        });
        confirm.present();
      }
    );
  }

}
