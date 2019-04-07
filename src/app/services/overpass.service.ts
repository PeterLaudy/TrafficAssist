import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverpassModel, Element } from './overpass.model';
import { map } from 'rxjs/internal/operators/map';
import { GPSConverter } from '../classes/gps-converter';
import { GPSLocation } from './anwb.model';

@Injectable()

export class OverpassService {

    constructor(private http: HttpClient) { }

    getCitiesAndRouteDetails(locations: GPSLocation[], bbox: number[]): Observable<{ cities: Element[], roads: GPSLocation[][]}> {
        console.log('Getting a list of cities and details of the route');
        const converter = new GPSConverter(bbox);
        const x1 = bbox[0] - (bbox[2] - bbox[0]) / 2;
        const y1 = bbox[1] - (bbox[3] - bbox[1]) / 2;
        const x2 = bbox[2] + (bbox[2] - bbox[0]) / 2;
        const y2 = bbox[3] + (bbox[3] - bbox[1]) / 2;
        let query = `node["place"="city"](${y1},${x1},${y2},${x2});`;
        query += `node["place"="town"](${y1},${x1},${y2},${x2});`;
        locations.forEach(loc => {
            query += `way["highway"](${loc.lat-0.001},${loc.lon-0.001},${loc.lat+0.001},${loc.lon+0.001});`;
        });

        const data = `[out:json];(${query});out body;>;out skel qt;`;
        const url = `https://overpass-api.de/api/interpreter`; // ?data=${data}`;
        return this.http.post<OverpassModel>(url, data)
            .pipe(
                map(overpass => {
                    const cities: Element[] = new Array<Element>();
                    for (const city of overpass.elements) {
                        if ((city.type === 'node') && city.tags && city.tags.place) {
                            let loc = converter.gpsToKm(city.lon, city.lat);
                            city.kmX = loc[0];
                            city.kmY = loc[1];
                            loc = converter.kmToSvg(city.kmX, city.kmY);
                            city.svgX = loc[0];
                            city.svgY = loc[1];
                            cities.push(city);
                        }
                    }

                    const roads: GPSLocation[][] = [];
                    overpass.elements.forEach(element => {
                        if ((element.type === 'way') && (null != element.tags) && (null != element.tags.highway)) {
                            const hw = element.tags.highway;
                            if ((hw === 'residential') || (hw === 'unclassified') || (hw === 'tertiary') ||
                                (hw === 'secondary') || (hw === 'primary') || (hw === 'living_street') ||
                                (hw === 'trunk') || (hw === 'motorway') || (hw === 'motorway_link') ||
                                (hw === 'trunk-link') || (hw === 'primary_link') || (hw === 'secondary_link') ||
                                (hw === 'tertiary_link') || (hw === 'road') || (hw === 'motorway_junction') ||
                                (hw === 'turning_loop') || (hw === 'mini_roundabout')) {
                                let nextWay: GPSLocation[] = [];
                                element.nodes.forEach(nodeRef => {
                                    overpass.elements.forEach(element => {
                                        if (element.id === nodeRef) {
                                            const gps = new GPSLocation();
                                            gps.lon = element.lon;
                                            gps.lat = element.lat;
                                            nextWay.push(gps);
                                        }
                                    });
                                });
                                roads.push(nextWay);
                            }
                        }
                    });

                    return { cities, roads };
                })
        );
    }
}
