export function metersToKilometers(visibilityInMeters: number): string {
    const visibilityKilometers = visibilityInMeters / 1000;
    return `${visibilityKilometers.toFixed(0)} km`;
}