import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RegisterPage } from '../pages/register/register';
import { FreedomPage } from '../pages/freedom/freedom';

import { IntroPage } from '../pages/intro/intro';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = RegisterPage;
  // rootPage: any = FreedomPage;

  introPage: any = IntroPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


    });

  }

  openPage(page){
    this.menu.close();
    this.nav.setRoot(page);
  }
}

