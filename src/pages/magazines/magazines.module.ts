import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagazinesPage } from './magazines';

@NgModule({
  declarations: [
    MagazinesPage
  ],
  imports: [
    IonicPageModule.forChild(MagazinesPage),
  ],
  exports: [
    MagazinesPage
  ]
})
export class MagazinesPageModule {}