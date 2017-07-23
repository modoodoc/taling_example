import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalingPage } from './taling';

@NgModule({
  declarations: [
    TalingPage,
  ],
  imports: [
    IonicPageModule.forChild(TalingPage),
  ],
  exports: [
    TalingPage
  ]
})
export class TalingPageModule {}
