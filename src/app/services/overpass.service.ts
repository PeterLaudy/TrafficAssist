import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverpassModel, Element } from './overpass.model';
import { map } from 'rxjs/internal/operators/map';
import { OpenRouteObject } from './openroute.model';

@Injectable()

export class OverpassService {

    constructor(private http: HttpClient) { }

    getCities(oro: OpenRouteObject): Observable<Element[]> {
        console.log('Getting a list of cities');
        const x1 = this.xBackTransform(oro, -200);
        const y1 = this.yBackTransform(oro, -200);
        const x2 = this.xBackTransform(oro, 200);
        const y2 = this.yBackTransform(oro, 200);
        const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["place"~"city|town"](${y1},${x1},${y2},${x2}););out;`;
        return this.http.get<OverpassModel>(url)
            .pipe(
                map(overpass => {
                    const result: Element[] = new Array<Element>();
                    for (const element of overpass.elements) {
                        const city: Element = {
                            type: element.type,
                            id: element.id,
                            lon: this.xTransform(oro, element.lon),
                            lat: this.yTransform(oro, element.lat),
                            tags: {
                                name: element.tags.name,
                                population: element.tags.population,
                                duration: `${Math.random() * 2 + 1}s`
                            }
                        };
                        result.push(city);
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

    private xBackTransform(oro: OpenRouteObject, x: number): number {
        return (x - oro.xDif) / oro.scale;
    }

    private yBackTransform(oro: OpenRouteObject, y: number): number {
        return (y - oro.yDif) / oro.scale;
    }
}
