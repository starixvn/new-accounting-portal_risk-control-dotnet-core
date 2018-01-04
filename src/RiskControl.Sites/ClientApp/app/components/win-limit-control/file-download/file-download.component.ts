import { Router, ActivatedRoute, Params } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { AuthenticationService, LoginTicket } from '../../../services/authentication.service';
import { FileDownloadService } from './file-download.service';

@Component({
    selector: 'win-limit-control/file-download',
    templateUrl: './file-download.component.html',
    styleUrls: ['./file-download.component.scss'],
    providers: [
        FileDownloadService
    ]
})
export class WinLimitControlFileDownLoadComponent implements OnInit {
    fileName: string;
    constructor(
        private http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private fileDownloadService: FileDownloadService
    ) { }

    ngOnInit() {
        let hash = this.activatedRoute.snapshot.queryParams["hash"];
        this.fileName = atob(hash);
    }

    download() {
        this.fileDownloadService.getFile(this.fileName)
            .subscribe(response => {
                saveAs(response, this.fileName)
            },
            error => {
                console.log("Error downloading the file.")
            });
    }
}
