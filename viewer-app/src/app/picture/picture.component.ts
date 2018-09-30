import { Component, OnInit } from '@angular/core';
import { LatestPictureService } from '../service/latest-picture.service';
import { IPicture } from '../models/i-picture';
import { observable, timer, Subscription } from 'rxjs';

@Component({
    selector: 'app-picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

    private LatestPictureService: LatestPictureService;
    latestPicture: IPicture;
    latestTimestamp: string;

    baseUrl = '/api/images/latest.jpg';
    url: string = this.baseUrl;
    serialnr = 0;
    secTimer: Subscription;
    timeStamp = 0;
    lastTimeStamp = 0;
    leapTime = 0;

    constructor() {
        console.log('PictureComponent.ctor');
        this.secTimer = timer(1000, 1000).subscribe((tt) => {
            this.timeStamp = tt;
            this.leapTime = tt - this.lastTimeStamp;
        });
    }

    ngOnInit() {
        console.log('PictureComponent.init');

        this.LatestPictureService = new LatestPictureService();
        this.LatestPictureService.latestTimestamp.subscribe(timestamp => {
            console.log('sub latest pic: ' + timestamp);
            this.latestTimestamp = timestamp;
            this.serialnr = this.serialnr + 1;
            this.url = this.baseUrl + '?' + this.serialnr;
            console.log('baseUrl2: ', this.url);
            this.lastTimeStamp = this.timeStamp;
        });
    }

}
