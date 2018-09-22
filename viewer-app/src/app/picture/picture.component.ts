import { Component, OnInit } from '@angular/core';
import { LatestPictureService } from '../service/latest-picture.service';
import { IPicture } from '../models/i-picture';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  private LatestPictureService: LatestPictureService;
  latestPicture: IPicture;
  latestTimestamp: string;

  baseUrl = 'images/latest.jpg';
  url: string = this.baseUrl;
  serialnr = 0;

  constructor() {
    console.log('ctor');
  }

  ngOnInit() {
    console.log('init');

    this.LatestPictureService = new LatestPictureService();
    this.LatestPictureService.latestTimestamp.subscribe(timestamp => {
        console.log('sub latest pic: ' + timestamp);
        this.latestTimestamp = timestamp;
        this.serialnr = this.serialnr + 1;
        this.url = this.baseUrl + '?' + this.serialnr;
    });
  }

}
