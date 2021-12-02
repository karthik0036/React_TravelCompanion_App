import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import  { getPlacesData, getWeatherData }   from './api';
import React, { useState, useEffect } from 'react';

import { CssBaseline, Grid } from '@material-ui/core';

function App() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [coords, setCoords] = useState({lat: 0, lng:0});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [weatherData, setWeatherData] = useState([]);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
      setCoords({lat:latitude,lng:longitude})
    })
  },[coords])

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces([]);
    setFilteredPlaces(filtered);
  }, [rating]);



  useEffect(( ) => {
    if (bounds.sw && bounds.ne) {
    setIsLoading(true);

    getWeatherData(coords.lat, coords.lng)
    .then((data) => setWeatherData(data));
    
    getPlacesData(type,bounds.sw,bounds.ne)
    .then((data)=>{
      setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
      setFilteredPlaces([])
      setIsLoading(false);
    })
  }
  }, [type,bounds])



    
    


  return (
    <>
      <CssBaseline />
      <Header setCoords={setCoords} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List places={filteredPlaces.length ? filteredPlaces : places} 
          childClicked={childClicked} 
          isLoading={isLoading} 
          rating={rating} setRating={setRating}
          type={type} setType={setType}/>
        </Grid>
        <Grid >
          <Map
          places={filteredPlaces.length ? filteredPlaces : places}
          weatherData={weatherData}
          setChildClicked={setChildClicked} setCoords={setCoords} 
          setBounds={setBounds} coords={coords}/>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
