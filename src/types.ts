export type Callback = (value: number) => void;

export interface Options {
    mass?: number;
    tension?: number;
    friction?: number | null;
    precision?: number;
    initialValue?: number;
    velocity?: number;
    targetValue?: number;
    onStart?: Callback | null;
    onUpdate?: Callback | null;
    onEnd?: Callback | null;
}

export type Preset = {
    mass: number;
    tension: number;
    friction?: number;
};

export type PresetName = 'gentle' | 'wobbly' | 'stiff' | 'slow' | 'molasses';
