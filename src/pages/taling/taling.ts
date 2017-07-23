import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-taling',
  templateUrl: 'taling.html',
})
export class TalingPage {

  modoodoc: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController) {
    this.modoodoc = '탈잉 튜터 안무혁입니다.';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TalingPage');
  }

  alertButton() {
    let alert = this.alertCtrl.create({
      title: '응 이해했어.'
    });
    alert.present();
  }

}
