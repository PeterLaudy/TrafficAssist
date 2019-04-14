/**
 * @class Step
 */
export interface Step {
    distance: number;
    duration: number;
    type: number;
    instruction: string;
    name: string;
    way_points: number[];
    exit_number?: number;
}

/**
 * @class Segment
 */
export interface Segment {
    distance: number;
    duration: number;
    steps: Step[];
}

/**
 * @class RoadAccessRestrictionSummary
 */
export interface RoadAccessRestrictionSummary {
    value: number;
    distance: number;
    amount: number;
}

/**
 * @class RoadAccessRestrictions
 */
export interface RoadAccessRestrictions {
    values: number[][];
    summary: RoadAccessRestrictionSummary[];
}

/**
 * @class Extras
 */
export interface Extras {
    roadaccessrestrictions: RoadAccessRestrictions;
}

/**
 * @class Warning
 */
export interface Warning {
    code: number;
    message: string;
}

/**
 * @class PropertySummary
 */
export interface PropertySummary {
    distance: number;
    duration: number;
}

/**
 * @class Properties
 */
export interface Properties {
    segments: Segment[];
    extras: Extras;
    warnings: Warning[];
    summary: PropertySummary;
    way_points: number[];
}

/**
 * @class Geometry
 */
export interface Geometry {
    coordinates: number[][];
    type: string;
}

/**
 * @class Feature
 */
export interface Feature {
    bbox: number[];
    type: string;
    properties: Properties;
    geometry: Geometry;
}

/**
 * @class Query
 */
export interface Query {
    coordinates: number[][];
    profile: string;
    format: string;
}

/**
 * @class Engine
 */
export interface Engine {
    version: string;
    build_date: Date;
}

/**
 * @class Metadata
 */
export interface Metadata {
    attribution: string;
    service: string;
    timestamp: number;
    query: Query;
    engine: Engine;
}

/**
 * @class OpenRouteModel
 */
export interface OpenRouteModel {
    type: string;
    features: Feature[];
    bbox: number[];
    metadata: Metadata;
}
