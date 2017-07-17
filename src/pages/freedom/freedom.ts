import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';


import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-freedom',
  templateUrl: 'freedom.html',
})
export class FreedomPage {

  happiness: number = 50;

  storageValue: any = '';

  client_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
              public alertCtrl: AlertController, public http: Http) {

    this.storage.set('MoDooDoc', 'is fantastic!');
  }

  ionViewDidLoad() {
    // this.storage.set('MoDooDoc', 'is fantastic!');
  }

  alertHappiness() {
    alert(this.happiness);
  }

  alertStorageValue() {
    this.storage.get('MoDooDoc').then((data) => {
      this.storageValue = data;
      let alert = this.alertCtrl.create({
        title: '모두닥 짱이다!',
        subTitle: 'MoDooDoc' + this.storageValue,
        buttons: ['OK']
      });
      alert.present();
    });

  }

  alertClientId() {
    this.http.get('https://fathomless-garden-38295.herokuapp.com/api/client/getclientid/')
    // javascript string을 javascript Object 로 전환함. : json() 의 역할.
      .map(res => res.json())
      .subscribe(
        data => {
          alert(data.client_id);
          this.client_id = data.client_id;
          this.storage.set('client_id', this.client_id);
        },
        error => {

        }
      )
  }


}
