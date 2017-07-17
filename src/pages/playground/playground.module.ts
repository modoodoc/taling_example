import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaygroundPage } from './playground';

@NgModule({
  declarations: [
    PlaygroundPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaygroundPage),
  ],
  exports: [
    PlaygroundPage
  ]
})
export class PlaygroundPageModule {}
