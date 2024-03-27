import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export interface WeatherDetailProps {
    visability: string;
    humidity: string;
    windSpeed: string;
    airPressure: string; 
    sunrise: string;
    sunset: string;
}


export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visability = '25km',
        humidity = '42%',
        windSpeed = '5km/h',
        airPressure = '1012 hPA',
        sunrise = '6:00',
        sunset = '18:00'
    } = props;
    return (
        <>
            <SingleWeatherDetail information='Visibility' icon={<LuEye />} value={props.visability} />
            <SingleWeatherDetail information='Humidity' icon={<FiDroplet />} value={props.humidity} />
            <SingleWeatherDetail information='Wind Speed' icon={<MdAir />} value={props.windSpeed} />
            <SingleWeatherDetail information='Air Pressure' icon={<ImMeter />} value={props.airPressure} />
            <SingleWeatherDetail information='Sunrise' icon={<LuSunrise />} value={props.sunrise} />
            <SingleWeatherDetail information='Sunset' icon={<LuSunset />} value={props.sunset} />
        </>
    )
}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
        <p className='whitewspace-nowrap'>{props.information}</p>
        <div className='text-3xl'>{props.icon}</div>
        <p className='text-xs'>{props.value}</p>
    </div>
  )
}