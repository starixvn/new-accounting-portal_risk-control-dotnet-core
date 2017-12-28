import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class FileDownloadService {
    constructor(
        private http: Http
    ) { }

    getFile(fileName: string, token: string) {
        const authHeader = `Bearer ${token}`;
        let fileUrl = `api/filedownload/excel?filename=${fileName}`;
        let header = new Headers({ Authorization: authHeader });

        return this.http.get(fileUrl, { headers: header, responseType: ResponseContentType.Blob })
            .map(response => response.blob());
    }
}
