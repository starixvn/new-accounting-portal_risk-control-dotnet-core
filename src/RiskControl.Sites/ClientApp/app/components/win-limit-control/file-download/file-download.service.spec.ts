import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { FileDownloadService } from './file-download.service';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('File download - FileDownloadSevice', () => {
    let service: FileDownloadService;
    let backend: MockBackend;
    let response = null;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => new Http(backendInstance, defaultOptions),
                    deps: [MockBackend, BaseRequestOptions]
                },
                FileDownloadService
            ]
        });
    });

    beforeEach(inject([FileDownloadService, MockBackend], (fileDownloadService: FileDownloadService, mockBackend: MockBackend) => {
        service = fileDownloadService;
        backend = mockBackend;
    }));

    it('should create a service', () => {
        expect(service).toBeTruthy();
    });

    it('should successfully get file', (done) => {
        let fileName = "winlimit-control";
        let blob = new Blob();

        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toEqual(RequestMethod.Get);
            expect(connection.request.url).toEqual('api/filedownload/excel?filename=' + fileName);
            let options = new ResponseOptions({
                status: 200,
                body: blob
            });
            connection.mockRespond(new Response(options));
        });

        service.getFile(fileName).subscribe((data) => {
            expect(data).toBeDefined();
            expect(data).toEqual(blob);
            done();
        });
    });

});
