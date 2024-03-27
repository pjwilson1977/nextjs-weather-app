export function convertWindSpeed(speedInMetersPerSecond: number): string {
    const speedInKilometersPerHour = (speedInMetersPerSecond * 3.6).toFixed(0);
    return `${speedInKilometersPerHour} km/h`
}