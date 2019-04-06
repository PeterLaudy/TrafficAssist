export class Step {
    distance: number;
    duration: number;
    type: number;
    instruction: string;
    name: string;
    way_points: number[];
    exit_number?: number;
}

export class Segment {
    distance: number;
    duration: number;
    steps: Step[];
}

export class Summary {
    distance: number;
    duration: number;
}

export class Properties {
    segments: Segment[];
    summary: Summary;
    way_points: number[];
}

export class Geometry {
    coordinates: number[][];
    type: string;
}

export class Feature {
    bbox: number[];
    type: string;
    properties: Properties;
    geometry: Geometry;
    kmBBox?: number[];
    svgBBox?: number[];
    kmGeometry?: Geometry;
    svgGeometry?: Geometry;
}

export class Query {
    coordinates: number[][];
    profile: string;
    format: string;
}

export class Engine {
    version: string;
    build_date: Date;
}

export class Metadata {
    attribution: string;
    service: string;
    timestamp: number;
    query: Query;
    engine: Engine;
}

export class OpenRouteObject {
    type: string;
    features: Feature[];
    bbox: number[];
    metadata: Metadata;
    kmBBox?: number[];
    svgBBox?: number[];
}
