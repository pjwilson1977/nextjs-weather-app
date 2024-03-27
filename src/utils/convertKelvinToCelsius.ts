export function convertKelvinToCelsius(kelvin: number): number {
    const tempInCelcius = kelvin - 273.15;
    return Math.floor(tempInCelcius);
}