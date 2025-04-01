import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environments } from '../../../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {

    public baseUrl: string = 'https://api.mapbox.com/search/geocode/v6/forward?q=';

    constructor( handler: HttpHandler ){
        // me permite utilizar las peticiones http
        super(handler);
    }

    public override get<T>( url: string, options: {
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
    }) {

        url = this.baseUrl + url;

        return super.get<T>( url, {
            params: {
                limit: 5,
                language: 'es',
                access_token: environments.apikey,
                ...options.params
            }
        });


    }

}