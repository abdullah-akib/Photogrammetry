
import { FlightInputs, FlightPlanResult, StepResult } from './types';
import { UNIT_MILE_TO_FT, UNIT_FT_TO_IN, UNIT_MPH_TO_FPS } from './constants';

export function calculateFlightPlan(inputs: FlightInputs): FlightPlanResult {
  const areaLength = Number(inputs.areaLength) || 0;
  const areaWidth = Number(inputs.areaWidth) || 0;
  const focalLength = Number(inputs.focalLength) || 0;
  const photoWidth = Number(inputs.photoWidth) || 0;
  const photoLength = Number(inputs.photoLength) || 0;
  const photoScale = Number(inputs.photoScale) || 1; // Default to 1 to avoid div by zero if empty
  const terrainElevation = Number(inputs.terrainElevation) || 0;
  const forwardOverlap = Number(inputs.forwardOverlap) || 0;
  const sideLap = Number(inputs.sideLap) || 0;
  const groundSpeed = Number(inputs.groundSpeed) || 0;
  const mapScale = Number(inputs.mapScale) || 1;

  const steps: StepResult[] = [];

  // (a) Flying Height
  const H_prime = (focalLength * photoScale) / UNIT_FT_TO_IN; // ft
  const H_msl = H_prime + terrainElevation;
  steps.push({
    id: 'a',
    title: 'Flying Height (H)',
    formula: 'H = (f × Scale) / 12 + h_avg',
    substitution: `${focalLength}" × ${photoScale} = ${(focalLength * photoScale).toLocaleString()} in = ${H_prime.toLocaleString()} ft. MSL = ${H_prime.toLocaleString()} + ${terrainElevation}`,
    result: `${H_msl.toLocaleString()} ft (above MSL)`,
    explanationKey: 'flying_height'
  });

  // (b) Ground distance between flight lines (Uses Photo Width)
  const sideLapDecimal = sideLap / 100;
  const effectiveWidthIn = photoWidth * (1 - sideLapDecimal);
  const W = (effectiveWidthIn * photoScale) / UNIT_FT_TO_IN;
  steps.push({
    id: 'b',
    title: 'Ground Distance Between Flight Lines',
    formula: 'W = S_width × Scale × (1 - Sidelap)',
    substitution: `${photoWidth}" × ${photoScale} × (1 - ${sideLapDecimal}) = ${W.toLocaleString()} ft`,
    result: `${W.toLocaleString()} ft`,
    explanationKey: 'line_spacing'
  });

  // (c) Number of flight lines
  const totalWidthFt = areaWidth * UNIT_MILE_TO_FT;
  const rawNumLines = W > 0 ? (totalWidthFt / W) : 0;
  const numLinesInteger = Math.ceil(rawNumLines);
  const totalLines = numLinesInteger + 1;
  steps.push({
    id: 'c',
    title: 'Number of Flight Lines',
    formula: 'N = ceil(Total Width / W) + 1',
    substitution: `${totalWidthFt.toLocaleString()} ft / ${W.toLocaleString()} ft = ${rawNumLines.toFixed(2)} → ${numLinesInteger} + 1`,
    result: `${totalLines} Lines`,
    explanationKey: 'num_lines'
  });

  // (d) Adjusted Spacing
  const divider = totalLines > 1 ? (totalLines - 1) : 1;
  const W_adj = totalWidthFt / divider;
  steps.push({
    id: 'd',
    title: 'Adjusted Spacing Between Flight Lines',
    formula: 'W_adj = Total Width / (N - 1)',
    substitution: `${totalWidthFt.toLocaleString()} ft / (${totalLines} - 1)`,
    result: `${W_adj.toLocaleString(undefined, {maximumFractionDigits: 1})} ft`,
    explanationKey: 'adj_spacing'
  });

  // (e) Spacing on map
  const mapSpacingIn = (W_adj / mapScale) * UNIT_FT_TO_IN;
  steps.push({
    id: 'e',
    title: 'Spacing of Lines on Flight Map',
    formula: 'w_map = (W_adj / Map Scale) × 12',
    substitution: `(${W_adj.toFixed(1)} / ${mapScale}) × 12`,
    result: `${mapSpacingIn.toFixed(2)}"`,
    explanationKey: 'map_spacing'
  });

  // (f) Ground distance between exposures (Uses Photo Length)
  const forwardOverlapDecimal = forwardOverlap / 100;
  const effectiveLengthIn = photoLength * (1 - forwardOverlapDecimal);
  const B = (effectiveLengthIn * photoScale) / UNIT_FT_TO_IN;
  steps.push({
    id: 'f',
    title: 'Ground Distance Between Exposures',
    formula: 'B = S_length × Scale × (1 - Overlap)',
    substitution: `${photoLength}" × ${photoScale} × (1 - ${forwardOverlapDecimal}) = ${B.toLocaleString()} ft`,
    result: `${B.toLocaleString()} ft`,
    explanationKey: 'exp_distance'
  });

  // (g) Exposure interval
  const V_fps = groundSpeed * UNIT_MPH_TO_FPS;
  const intervalRaw = V_fps > 0 ? B / V_fps : 0;
  const intervalRounded = Math.round(intervalRaw);
  steps.push({
    id: 'g',
    title: 'Exposure Interval',
    formula: 't = B / V',
    substitution: `${B.toLocaleString()} ft / ${V_fps.toFixed(2)} ft/s = ${intervalRaw.toFixed(2)} s`,
    result: `≈ ${intervalRounded} Seconds`,
    explanationKey: 'exp_interval'
  });

  // (h) Adjusted ground distance between exposures
  const B_adj = V_fps * intervalRounded;
  steps.push({
    id: 'h',
    title: 'Adjusted Distance Between Exposures',
    formula: 'B_adj = V × t_rounded',
    substitution: `${V_fps.toFixed(2)} ft/s × ${intervalRounded} s`,
    result: `${B_adj.toLocaleString(undefined, {maximumFractionDigits: 1})} ft`,
    explanationKey: 'adj_exp_dist'
  });

  // (i) Number of photographs per line
  const totalLengthFt = areaLength * UNIT_MILE_TO_FT;
  const photosPerLineRaw = B_adj > 0 ? (totalLengthFt / B_adj) : 0;
  const photosPerLineInt = Math.ceil(photosPerLineRaw) + 4; // Adding 2 at each end
  steps.push({
    id: 'i',
    title: 'Number of Photographs Per Flight Line',
    formula: 'n = ceil(Total Length / B_adj) + 4',
    substitution: `${totalLengthFt.toLocaleString()} ft / ${B_adj.toFixed(1)} ft = ${photosPerLineRaw.toFixed(2)} → ${Math.ceil(photosPerLineRaw)} + 4`,
    result: `${photosPerLineInt} Photos`,
    explanationKey: 'photos_per_line'
  });

  // (j) Total Photos
  const totalPhotos = totalLines * photosPerLineInt;
  steps.push({
    id: 'j',
    title: 'Total Number of Photographs',
    formula: 'Total = N × n',
    substitution: `${totalLines} × ${photosPerLineInt}`,
    result: `${totalPhotos.toLocaleString()} Photos`,
    explanationKey: 'total_photos'
  });

  return {
    steps,
    summary: {
      totalPhotos,
      flyingHeightMSL: `${H_msl.toLocaleString()} ft`,
      numLines: totalLines,
      photosPerLine: photosPerLineInt
    }
  };
}
