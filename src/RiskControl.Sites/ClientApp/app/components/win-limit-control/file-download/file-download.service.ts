import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileDownloadService {
    constructor(
        private http: HttpClient
    ) { }

    getFile(fileName: string): Observable<Blob> {
        const fileUrl = `api/filedownload/excel?filename=${fileName}`;
        return this.http.get(fileUrl, {
            responseType: 'blob'
        });
    }
}
