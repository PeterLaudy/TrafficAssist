import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenRouteObject } from './openroute.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()

export class OpenrouteService {

    key: string;

    constructor(private http: HttpClient) {
        this.getAPIKey();
    }

    private async getAPIKey() {
        await this.http.get<any>('assets/openrouteservice.key')
            .subscribe(result => {
                this.key = result.key;
            });
    }

    getRoute(start: string[], destination: string[]): Observable<OpenRouteObject> {
        console.log(`Getting route for ${start} => ${destination}`);
        const url: string = `https://api.openrouteservice.org/v2/directions/driving-car?`
            + `api_key=${this.key}&start=`
            + `${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`;
        return this.http.get<OpenRouteObject>(url)
            .pipe(
                // Multiply all coordinates with 100 otherwise the lines are so thin, they are sometimes not rendered correctly in Chrome.
                map(result => {
                    const xScale = 170 / (result.bbox[2] - result.bbox[0]);
                    const yScale = 170 / (result.bbox[3] - result.bbox[1]);
                    result.scale = Math.min(xScale, yScale);

                    result.xDif = (result.bbox[0] - result.bbox[2]) * (result.scale / 2) - result.bbox[0] * result.scale;
                    result.yDif = (result.bbox[1] - result.bbox[3]) * (result.scale / 2) - result.bbox[1] * result.scale;

                    result.bbox[0] = this.xTransform(result, result.bbox[0]);
                    result.bbox[1] = this.yTransform(result, result.bbox[1]);
                    result.bbox[2] = this.xTransform(result, result.bbox[2]);
                    result.bbox[3] = this.yTransform(result, result.bbox[3]);
                    for (const f of result.features) {
                        f.bbox[0] = this.xTransform(result, f.bbox[0]);
                        f.bbox[1] = this.yTransform(result, f.bbox[1]);
                        f.bbox[2] = this.xTransform(result, f.bbox[2]);
                        f.bbox[3] = this.yTransform(result, f.bbox[3]);
                        for (const c of f.geometry.coordinates) {
                            c[0] = this.xTransform(result, c[0]);
                            c[1] = this.yTransform(result, c[1]);
                        }
                    }
                    return result;
                })
        );
    }

    private xTransform(oro: OpenRouteObject, x: number): number {
        return x * oro.scale + oro.xDif;
    }

    private yTransform(oro: OpenRouteObject, y: number): number {
        return y * oro.scale + oro.yDif;
    }
}
