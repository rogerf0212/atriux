export interface PlacesResponse {
    type:        string;
    query:       string[];
    features:    Feature[];
    attribution: string;
}

export interface Feature {
    id:            string;
    type:          string;
    place_type:    string[];
    relevance:     number;
    properties:    Properties;
    text_es:       string;
    place_name_es: string;
    text:          string;
    place_name:    string;
    bbox?:         number[];
    center:        number[];
    geometry:      Geometry;
    context:       Context[];
}

export interface Context {
    id:           string;
    wikidata?:    Wikidata;
    short_code?:  ShortCode;
    text_es:      string;
    language_es?: Language;
    text:         string;
    language?:    Language;
}

export enum Language {
    Es = "es",
}

export enum ShortCode {
    CR = "cr",
    CRA = "CR-A",
}

export enum Wikidata {
    Q37104 = "Q37104",
    Q502188 = "Q502188",
    Q800 = "Q800",
}

export interface Geometry {
    type:        string;
    coordinates: number[];
}

export interface Properties {
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    name: string; // Este es el nombre que necesitas
    name_preferred: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
    place_formatted: string; // Puedes usar esto como descripción
    bbox?: number[];
    context: Context[];
}