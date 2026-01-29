
import { FlightInputs } from './types';

export const INITIAL_INPUTS: FlightInputs = {
  areaLength: '',
  areaWidth: '',
  focalLength: '',
  photoWidth: '',
  photoLength: '',
  photoScale: '',
  terrainElevation: '',
  forwardOverlap: '',
  sideLap: '',
  groundSpeed: '',
  mapScale: '',
};

export const UNIT_MILE_TO_FT = 5280;
export const UNIT_FT_TO_IN = 12;
export const UNIT_MPH_TO_FPS = 1.46667; // approx (5280/3600)
