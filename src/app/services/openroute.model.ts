export interface Step {
    distance: number;
    duration: number;
    type: number;
    instruction: string;
    name: string;
    way_points: number[];
    exit_number?: number;
}

export interface Segment {
    distance: number;
    duration: number;
    steps: Step[];
}

export interface Summary {
    distance: number;
    duration: number;
}

export interface Properties {
    segments: Segment[];
    summary: Summary;
    way_points: number[];
}

export interface Geometry {
    coordinates: number[][];
    type: string;
}

export interface Feature {
    bbox: number[];
    type: string;
    properties: Properties;
    geometry: Geometry;
}

export interface Query {
    coordinates: number[][];
    profile: string;
    format: string;
}

export interface Engine {
    version: string;
    build_date: Date;
}

export interface Metadata {
    attribution: string;
    service: string;
    timestamp: number;
    query: Query;
    engine: Engine;
}

export interface OpenRouteObject {
    type: string;
    features: Feature[];
    bbox: number[];
    metadata: Metadata;
    scale?: number;
    xDif?: number;
    yDif?: number;
}
