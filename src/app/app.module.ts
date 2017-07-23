import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule }    from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { RegisterPage } from '../pages/register/register';
import { CommentPage } from '../pages/comment/comment';
import { PlaygroundPage } from '../pages/playground/playground';
import { LoginPage } from '../pages/login/login';
import { IntroPage } from '../pages/intro/intro';
import { FreedomPage } from '../pages/freedom/freedom';
import { AlbumPage } from '../pages/album/album';
import { TalingPage } from '../pages/taling/taling';

// custom provider
import { HttpWithTokenProvider } from '../providers/http-with-token/http-with-token';
import { MagicWandProvider } from '../providers/magic-wand/magic-wand';
import { CommonVariableProvider } from '../providers/common-variable/common-variable';
import { KoreanTimePipe } from '../pipes/korean-time/korean-time';
import { DataProvider } from '../providers/data/data';

@NgModule({
  declarations: [
    MyApp,
    RegisterPage, CommentPage, PlaygroundPage, LoginPage, IntroPage, FreedomPage, AlbumPage, TalingPage,
    KoreanTimePipe,
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '뒤로가기',
      ios: {
        statusbarPadding: true
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage, CommentPage, PlaygroundPage, LoginPage, IntroPage, FreedomPage, AlbumPage, TalingPage,
  ],
  providers: [
    // native
    StatusBar, SplashScreen, Camera, File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    // custom
    HttpWithTokenProvider,
    MagicWandProvider,
    CommonVariableProvider,
    DataProvider
  ]
})
export class AppModule {}
