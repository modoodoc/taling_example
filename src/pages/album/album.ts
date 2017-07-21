import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { DataProvider } from '../../providers/data/data';
import { PictureModel } from '../../models/picture-model';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage {

  pictures: PictureModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera,
              public file: File, public dataProvider: DataProvider, public platform: Platform) {

    this.platform.ready().then(() => {
      this.loadPicture();
    });
  }

  ionViewDidLoad() {

  }

  loadPicture() {
    this.dataProvider.getData().then(
      (pictures) => {

        console.log(pictures);

        let savedPictures: any = false;

        if(typeof(pictures) != 'undefined'){
          savedPictures = JSON.parse(pictures);
        }

        if(savedPictures){
          savedPictures.forEach(picture => {
            this.pictures.push(new PictureModel(picture.image, picture.date));
          })
        }
      }
    )
  }

  takePicture() {

    console.log('take photo!');

    let options = {
      quality: 100,
      destinationType: 1, //return a path to the image on the device
      sourceType: 1, //use the camera to grab the image
      encodingType: 0, //return the image in jpeg format
      cameraDirection: 1, //front facing camera
      saveToPhotoAlbum: true //save a copy to the users photo album as well
    };

    this.camera.getPicture(options).then(

      (imagePath) => {

        console.log(imagePath);

        //Grab the file name
        let currentName = imagePath.replace(/^.*[\\\/]/, '');

        //Create a new file name
        let d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpg";

        if(this.platform.is('ios')){

          //Move the file to permanent storage
          this.file.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName).then(
            (success) => {
              console.log(success);
              this.createPicture(success.nativeURL);

            },
            (error) => {

              console.log(error);

            }
          );

        } else {
          this.createPicture(imagePath);
        }

      },

      (error) => {
        console.log(error);
      }
    );
  }

  createPicture(picture) {

    let newPicture = new PictureModel(picture, new Date());
    this.pictures.unshift(newPicture);
    this.dataProvider.save(this.pictures);

    console.log(this.pictures);
    console.log('createPicture function!!');

  }

}
