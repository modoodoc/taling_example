import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, ActionSheetController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { PlaygroundPage } from '../pages/playground/playground';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { FreedomPage } from '../pages/freedom/freedom';
import { AlbumPage } from '../pages/album/album';

import { IntroPage } from '../pages/intro/intro';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = PlaygroundPage;

  introPage: any = IntroPage;
  loginPage: any = LoginPage;
  registerPage: any = RegisterPage;
  albumPage: any = AlbumPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController,
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public storage: Storage,
              public http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();

    });

  }

  openPage(page){
    this.menu.close();
    this.nav.setRoot(page);
  }

  logout() {
    console.log('logout!!');
    let actionSheet = this.actionSheetCtrl.create({
      title: '로그아웃 하시겠습니까?',
      buttons: [
        {
          text: '로그아웃',
          role: 'destructive',
          handler: () => {
            Observable.forkJoin([
              this.storage.remove('access_token'),
              this.storage.remove('refresh_token'),
              this.storage.remove('client_id')
            ]).subscribe(
              data => {
                console.log(data);

                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.menu.close();
                  this.nav.setRoot(PlaygroundPage);

                  let toast = this.toastCtrl.create({
                    message: '로그아웃 완료!',
                    duration: 2000,
                    position: 'middle'
                  });
                  toast.present();
                });


              }
            )
            // 꼭 넣어야 함!!
            return false;
          }
        }
      ]

    });
    actionSheet.present();
  }
}

