import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreedomPage } from './freedom';

@NgModule({
  declarations: [
    FreedomPage,
  ],
  imports: [
    IonicPageModule.forChild(FreedomPage),
  ],
  exports: [
    FreedomPage
  ]
})
export class FreedomPageModule {}
