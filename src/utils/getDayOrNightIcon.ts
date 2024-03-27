export function getDayOrNightIcon(iconName: string, dateTimeString: string): string {
    const currentHour = new Date(dateTimeString).getHours();    
    const isDayTime = currentHour >= 6 && currentHour < 18;
    //return iconName;
    return isDayTime ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}