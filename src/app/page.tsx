'use client';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { placeAtom, loadingCityAtom } from "./atom";
import { compareAsc, format, fromUnixTime } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import WeatherDetails from "@/components/WeatherDetails";
import { fi } from "date-fns/locale";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: CityData;
}

interface WeatherEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface CityData {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}


export default function Home() {  
  const [ place, setPlace ] = useAtom(placeAtom);
  const [loadingCity,  ] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${apiKey}&ctn=56`);            
      return data;
    }    
  });

  useEffect(() => {
    refetch();
  }, [place,refetch]);

  const uniqueDates = [
    ...new Set(data?.list.map((entry) => {      
      // const formatentry = format(new Date(entry.dt_txt), 'dd/MM/yyyy');
      const formatentry = new Date(entry.dt * 1000).toISOString().split('T')[0];
      //console.log("formatentry", formatentry);
      return formatentry;
    })),
  ];

  // Other
  // const uniqueDates = [
  //   ...new Set(data?.list.map((entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]) ),
  // ];

  const firstDataForEachDate = uniqueDates.map((date) => { 
    return data?.list.find((entry) => {      
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];      
      const entryHour = new Date(entry.dt * 1000).getHours();            
      return entryDate === date && (entryHour >= 5 && entryHour <= 7);      
    });        
  });

  // TODO: fix temp and sunrise & sunset
  //console.log("data", data?.city);
  //console.log("data", data?.city);
  //console.log(data?.list);
  //console.log(data.city.sunrise);
  //console.log("uniqueDates", uniqueDates);
  //console.log("firstDataForEachDate", firstDataForEachDate);

  const firstData = data?.list[0];

  if (isLoading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>        
      </div>
    );
  }

  if (error) {
    console.log(error);
    return 'An error has occurred';
  } 

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today */}

        {loadingCity ? <WeatherSkeleton /> : (
        <>
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flx gap-1 text-2xl items-end">
              {format(firstData?.dt_txt ?? '', 'EEEE')} <span className="text-lg">[{format(firstData?.dt_txt ?? '', 'dd/MM/yyyy')}]</span>
            </h2>
            <Container className=" gap-10 px-6 items-center">
              {/* Temprature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">{convertKelvinToCelsius(firstData?.main.temp ?? 0)}&deg;c</span>
                <p className="text-xs space-x-1 whitespace-nowrap">Feels like {convertKelvinToCelsius(firstData?.main.temp ?? 0)}&deg;c</p>
                <p className="text-xs space-x-2 ">
                  <span>{convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}&deg;c &darr;</span>
                  <span>{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}&deg;c &uarr;</span>                
                </p>
                </div>
              <div className=" flex flex-col px-4"></div>
              {/* Temp by Time */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">                
                {data?.list.map((entry, index) => (                    
                    <div key={index} className="flex flex-col justify-between gap-2 items-center text-xs">
                      <p className="whitespace-nowrap">
                        {format(entry.dt_txt,'p')}
                      </p>
                      <WeatherIcon iconName={getDayOrNightIcon(entry?.weather[0].icon, entry.dt_txt)} />
                      <p className="whitespace-nowrap">
                        {convertKelvinToCelsius(entry?.main.temp)}&deg;c                        
                      </p>
                    </div>
                  ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* Left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData?.weather[0].description}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? '', firstData?.dt_txt ?? '')} />              
            </Container>
            {/* Right */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails 
              visability={metersToKilometers(firstData?.visibility ?? 10000)} 
              humidity={`${firstData?.main.humidity.toString() ?? ''}%`} 
              windSpeed={`${convertWindSpeed(firstData?.wind.speed ?? 5)}`}
              airPressure={`${firstData?.main.pressure.toString() ?? ''} hPA`} 
              sunrise={`${format(fromUnixTime(data.city.sunrise ?? 1710281707),'p')} `} 
              sunset={`${format(fromUnixTime(data.city.sunset ?? 1710281707),'p')} `} 
              />
            </Container>
          </div>
        </section>
        {/* 7 Day Forecast */}
        {/* <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">7 Day Forecast</p>
          {firstDataForEachDate.map((entry, index) => (
            
            <ForecastWeatherDetail 
              key={index} 
              date={format(new Date(entry.dt_txt), 'dd/MM')}
              day={format(new Date(entry.dt_txt), 'EEEE')}
              temp={convertKelvinToCelsius(entry.main.temp)}
              feels_like={convertKelvinToCelsius(entry.main.feels_like)}
              temp_min={convertKelvinToCelsius(entry.main.temp_min)}
              temp_max={convertKelvinToCelsius(entry.main.temp_max)}
              description={entry.weather[0].description}
              weatherIcon={entry.weather[0].icon}
              visability={metersToKilometers(entry.visibility)}
              humidity={`${entry.main.humidity}%`}
              windSpeed={convertWindSpeed(entry.wind.speed)}
              airPressure={`${entry.main.pressure} hPA`}
              sunrise={format(fromUnixTime(data.city.sunrise),'p')}
              sunset={format(fromUnixTime(data.city.sunset),'p')}

            /> 
            ))
          }          
        </section> */}
        </>)}

      </main>
    </div>
  );
}


function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}