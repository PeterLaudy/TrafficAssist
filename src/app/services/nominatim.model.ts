/**
 * @class NominatimModel
 */
export class NominatimModel {
    placeID: number;
    licence: string;
    osmType: string;
    osmID: number;
    boundingbox: string[];
    lat: number;
    lon: number;
    displayName: string;
    class: string;
    type: string;
    importance: number;
}
