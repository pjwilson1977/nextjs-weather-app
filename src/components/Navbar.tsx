'use client';

import React from "react";
import { MdSunny, MdOutlineMyLocation, MdOutlineLocationOn } from "react-icons/md";
import Searchbox from "./Searchbox";
import { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { placeAtom, loadingCityAtom } from "../app/atom";

const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;
type Props = { location?: string};

export default function Navbar({ location }: Props) {
  const [ city, setCity ] = useState('Perth');
  const [ error, setError ] = useState('');

  const [ suggestions, setSuggestions ] = useState<string[]>([]);
  const [ showSuggestions, setShowSuggestions ] = useState(false);
  const [ place, setPlace ] = useAtom(placeAtom);
  const [_, setLoadingCity ] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length > 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${apiKey}`);        
        //console.log(response);
        //const suggestions = response.data.list.map((item: any) => `${item.name}, ${item.sys.country}`);
        //const suggestions = response.data.list.map((item: any) => `${item.name} - ${item.sys.country} - ${item.id}`);        
        const suggestions = response.data.list.map((item: any) => `${item.name}`);        
        setSuggestions(suggestions);
        setError('');
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    //console.log(value);
    setCity(value);    
    setShowSuggestions(false);
  }

function handleSubmitSearch(e: React.FormEvent<HTMLButtonElement>) {
  setLoadingCity(true);
  e.preventDefault();
  //console.log(e);
  //console.log(suggestions);
  if(suggestions.length === 0) { 
    setError('No results found');  
    setLoadingCity(false);
  } else {
    setError(''); 
    setTimeout(() => {
      setLoadingCity(false);
      setPlace(city);
    setShowSuggestions(false);   
    }, 5000);    
  }

}

function handleLocationClick() {
  console.log("handleLocationClick");
  navigator.geolocation.getCurrentPosition(async(position) => {
    console.log(position);
    const {latitude, longitude} = position.coords;
    try {
      setLoadingCity(true);       
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);        
      console.log(response);      
      setTimeout(() => { 
        setLoadingCity(false);              
        setPlace(response.data.name);
      }, 5000);
      
    } catch (err) {
      console.log(err);
    }
  });
}


  return (
    <>
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-77xl px-3 mx-auto">
        <p className="flex items-center justify-center gap-2">
        <a className="navbar-brand" href="#">Weather</a><MdSunny className="text-3xl mt-1 text-yellow-300" />
        </p>
        <section className="flex gap-2 items-center">
            <MdOutlineMyLocation title="Your current location" onClick={handleLocationClick} className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"/>
            <MdOutlineLocationOn className="text-2xl"/>
            <p className="text-slate-900/90 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              {/* Search Box */}
                <Searchbox 
                value={city} 
                onSubmit={(e) => handleSubmitSearch(e)} 
                onChange={(e) => handleInputChange(e.target.value)}                 
                />
                <SuggestionBox {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }} />
            </div>            
        </section>                
      </div>
    </nav>
    <section className="flex max-w-7xl px-3 md:hidden">
          <div className="relative">
              {/* Search Box */}
                <Searchbox 
                value={city} 
                onSubmit={(e) => handleSubmitSearch(e)} 
                onChange={(e) => handleInputChange(e.target.value)}                 
                />
                <SuggestionBox {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }} />
          </div>
      </section>
    </>
  );
}


function SuggestionBox({showSuggestions, suggestions, handleSuggestionClick, error}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <> { ( (showSuggestions && suggestions.length > 0) || error ) && (
      <ul className="mb-4 bg-white absolute border top-[40px] left -0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
        {error && suggestions.length < 1 && (
          <li className="p-1 text-red-500">{error}</li>
        )}
        {suggestions.map((item, index) => (
          <li 
            key={index} 
            onClick={(e) => handleSuggestionClick(item)} 
            className="cursor-pointer p-1 rounded hover:bg-gray-200"            
            >{item}</li>
        ))}
        
      </ul>
      ) }
    </>    
  );
}