export interface IServices {
    typedefs: {
        type: string;
        fieldnames: string[];
        fieldtypes: string[];
        fieldarraylen: number[];
        examples: string[];
        constnames: string[];
        constvalues: string[];
    }[];
}