import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius';


export interface ForecastWeatherDetailProps extends WeatherDetailProps {
    weatherIcon: string;
    date: string;
    day: string;
    temp: number; 
    feels_like: string;
    temp_min: string;
    temp_max: string;
    description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
    const {
        weatherIcon = '02d',
        date = '13/03',
        day = 'Wednesday',
        temp = 15,
        feels_like = '15',
        temp_min = '10',
        temp_max = '20',
        description = '02d'
    } = props;

  return (
    <Container className='gap-4'>
        {/* Left */}
        <section className=' flex gap-4 items-center px-4'>
            <div className=' flex flex-col items-center'>
                <WeatherIcon iconName={props.weatherIcon} />
                <p>{props.date}</p>
                <p className='text-sm'>{props.day}</p>
            </div>
            <div className='flex flex-col px-4'>
                <span className='text-5xl'>{convertKelvinToCelsius(temp ?? 0)}&deg;c</span>                
                <p className='capitalize'>{description}</p>
            </div>
        </section>
        {/* Right */}
        <section className=' overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
            <WeatherDetails {...props} />
        </section>
    </Container>
  )
}