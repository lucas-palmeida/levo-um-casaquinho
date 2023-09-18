import axios from "axios";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import { colorPalette, translateConditions, weekday } from "./constants/constants.js"

function App() {
  const [weather, setWeather] = useState(undefined);
  const [forecast, setForecast] = useState(undefined);
  const [city, setCity] = useState("Rio de Janeiro");
  const [cityName, setCityName] = useState(undefined);
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

  function dateFormatter(date) {
    const testDate = new Date(date);
    return `${testDate.getDate()}/${testDate.getMonth()+1} (${weekday[testDate.getDay()]})`;
  }

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br`)
    .then((res) => {
      setWeather(res.data)
    })
    .catch((err) => console.log(err));
  }, [city]);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br`)
    .then((res) => {
      const arr = [];
      res.data.list.forEach(l => {
        const prev = {
          time: l.dt,
          day: dateFormatter(l.dt_txt),
          temp: (l.main.temp-273).toFixed(1),
        }
        arr.push(prev);
      })
      setForecast(arr);
    })
    .catch((err) => console.log(err));
  }, [city]);

  if (weather === undefined || forecast === undefined) {
    return <div>Carregando...</div>;
  }

  function handleForm(e) {
    setCityName(e.target.value);
  }

  function testando(e) {
    e.preventDefault();
    setCity(cityName);
  }

  return (
    <Container>
      <Title>Levo um casaquinho?</Title>
      <SearchContainer onSubmit={testando}>
        <input type="search" name="searchbar" id="searchbar" onChange={handleForm}/>
        <button type="submit">Buscar</button>
      </SearchContainer>
      
      <WeatherContainer className={`${colorPalette[weather.weather[0].main]}`}>
        <PlaceContainer>
          <h3>Agora: {weather.name}</h3>
          <br />
          <p>Mínima: {(weather.main.temp_min-273).toFixed(1)}°C</p>
          <p>Máxima: {(weather.main.temp_max-273).toFixed(1)}°C</p>  
        </PlaceContainer>
        <TemperatureContainer>
          <span>{translateConditions[weather.weather[0].main]}</span>
          <p>{(weather.main.temp-273).toFixed(1)}°C</p>
        </TemperatureContainer>
      </WeatherContainer>

      <GraphContainer>
      <LineChart
        width={600}
        height={400}
        data={forecast}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="day" />
        <YAxis domain={[0, 'dataMax + 12']}/>
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="temp" stroke="#ff7300" />
      </LineChart>
      </GraphContainer>
    </Container>
  )
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-weight: 500;
`;

const Title = styled.h1`
  margin: 15px;
  font-size: 28px;
  font-weight: 500;
  color: #1B1BA0;
`;

const SearchContainer = styled.form`
`;

const WeatherContainer = styled.div`
  width: 500px;
  height: 90px;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  margin: 30px;
  background-color: #808080;
  border-radius: 15px;
  color: #FEFEFE;
  &.yellow {
    background-color: #e4e400;
  }
  &.gray {
    background-color: gray;
  }
  &.blue {
    background-color: blue;
  }
  &.lightgray {
    background-color: lightgray;
  }
  &.purple {
    background-color: purple;
  }
  &.lightblue {
    background-color: lightblue;
  }
`;

const PlaceContainer = styled.div`
  h3 {
    font-size: 18px;
  }
  p {
    font-size: 12px;
  }
`;

const TemperatureContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: end;
  span {
    font-size: 10px;
  }
  p {
    font-size: 32px;
  }
`;

const GraphContainer = styled.div`
  width: auto;
  height: 250px;
`;

export default App
