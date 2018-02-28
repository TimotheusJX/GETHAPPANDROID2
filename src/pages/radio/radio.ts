import { Component, Inject } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { RESTANGULAR_RADIO } from '../shared/restConfig';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { RadioPlaylist } from '../shared/radioPlaylist';
import { Radiolinks } from '../shared/radiolinks';
import { BackgroundMode } from '@ionic-native/background-mode';

@IonicPage({})
@Component({
  selector: 'page-radio',
  templateUrl: 'radio.html'
})

export class RadioPage {
  radio: MediaObject;
  isStreaming: boolean = false;
  radioplaylist: RadioPlaylist;
  radiolinks: Radiolinks;
  private alive: boolean;
  private interval: number;
  errMess: string;

  constructor(
    private media: Media,  
    public backgroundMode : BackgroundMode,
    public platform: Platform,
    @Inject(Restangular) public Restangular,
    @Inject(RESTANGULAR_RADIO) public RestangularRadio
  ) {
    this.alive = true;
    this.interval = 5000;
  }

  ngOnInit() {
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.prepareRadioDetail().subscribe((data) => {
          //first insertion radioplaylist is null, subsequent change only update when current title changes
          console.log("detail");
          console.log(data);
          if(this.radioplaylist == null){
            this.radioplaylist = data.radioplaylist;
          }else if(this.radioplaylist != null && this.radioplaylist.current.title != data.radioplaylist.current.title){
            this.radioplaylist = data.radioplaylist;
          }
        }, errmess => {this.radioplaylist = null; this.errMess = <any>errmess});
      });
    this.prepareAudioFile().subscribe((data) => {
      console.log("links: " + data);
      this.radiolinks = data;
      this.platform.ready().then(() => {
        this.radio = this.media.create(this.radiolinks.radiolink);
      })
    }, errmess => {this.radiolinks = null; this.errMess = <any>errmess});
  }
  ngOnDestroy(){
    //console.log("destroy");
    this.alive = false; // switches your TimerObservable off
  }

  ionViewWillLeave(){
    this.disableBackgroundMode();
    this.radio.stop();
    this.radio.release();
  }
  
  prepareAudioFile(): Observable<any> {
  //  let url = "http://biblewitness.com:8000/listen.pls";

  /*  this.platform.ready().then(() => {
      this.radio = this.media.create(url);
    })*/
    return this.Restangular.one('radioresources').get();
  }

  prepareRadioDetail(): Observable<any> {
    //console.log("start");
    return this.RestangularRadio.one('db2').get();
  }

  playRadio() {
    this.enableBackgroundMode();
    this.radio.play();
    this.isStreaming = true;
  }

  pauseRadio() {
    this.disableBackgroundMode();
    this.radio.pause();
    this.isStreaming = false;
  }

  private enableBackgroundMode(): void {
    if(!this.backgroundMode.isEnabled()) {
      console.log("enable background.....");
      this.backgroundMode.enable();
    }
  }

  private disableBackgroundMode(): void {
      if(this.backgroundMode.isEnabled()) {
        console.log("disable background.....");
        this.backgroundMode.disable();
      }
  }
}
