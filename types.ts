
export interface FlightInputs {
  areaLength: string; // miles
  areaWidth: string; // miles
  focalLength: string; // inches
  photoWidth: string; // inches (across-track, for side lap)
  photoLength: string; // inches (along-track, for forward overlap)
  photoScale: string; // denominator (e.g., 10000 for 1:10000)
  terrainElevation: string; // ft
  forwardOverlap: string; // percentage (e.g., 60)
  sideLap: string; // percentage (e.g., 25)
  groundSpeed: string; // mph
  mapScale: string; // denominator
}

export interface StepResult {
  id: string;
  title: string;
  formula: string;
  substitution: string;
  result: string;
  explanationKey: string;
}

export interface FlightPlanResult {
  steps: StepResult[];
  summary: {
    totalPhotos: number;
    flyingHeightMSL: string;
    numLines: number;
    photosPerLine: number;
  };
}
