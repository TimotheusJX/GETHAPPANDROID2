import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RestangularModule, Restangular } from 'ngx-restangular';

import { FeaturedItems } from '../shared/featuredItems';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FeaturedItems[];
  errMess: string;    

  constructor(public navCtrl: NavController, private restangular: Restangular) {
    this.getFeaturedItems().subscribe((data) => {
      console.log(data);
      this.items = data;
    }, errmess => {this.items = null; this.errMess = <any>errmess});
  }

  getFeaturedItems(): Observable<FeaturedItems[]> {
    return this.restangular.all('posts').getList();
  }

}
