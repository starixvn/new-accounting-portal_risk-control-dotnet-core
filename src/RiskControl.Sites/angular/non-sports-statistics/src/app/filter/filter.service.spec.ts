import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { FilterService, Product, Site, GameType, Device, Currency, Permission } from './index';
const permission = require('./mocks/permission.json') as Permission;
const products = require('./mocks/products.json') as Product[];
const sites = require('./mocks/sites.json') as Site[];
const gameTypes = require('./mocks/game-types.json') as GameType[];
const devices = require('./mocks/devices.json') as Device[];
const currencies = require('./mocks/currencies.json') as Currency[];

export class FakeFilterService extends FilterService {
    getPermission(): Observable<Permission> {
        return of(permission);
    }

    getProducts(): Observable<Product[]> {
        return of(products);
    }

    getSites(productIds = ''): Observable<Site[]> {
        return of(sites);
    }

    getGameTypes(): Observable<GameType[]> {
        return of(gameTypes);
    }

    getDevices(): Observable<Device[]> {
        return of(devices);
    }

    getCurrencies(): Observable<Currency[]> {
        return of(currencies);
    }
}
