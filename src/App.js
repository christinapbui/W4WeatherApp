import React, { Component } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Button } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const apiKey = process.env.REACT_APP_APIKEY; // brings API key from .env file--hid API key in .env file
let FC =true;
let globalCity = null 
let urlFrom = ""
export default class App extends Component {

    // 10. render - will initialize
    constructor(props){
        super(props) // 10.1 "super" means call parent constructor. 
        this.state={
            weatherResult:null // 10.2 null because we don't know what's going to come
        } // 11. this will render UI depending on "this.state"
    }

    getCurrentWeather = async(lat,lon) => { // 4. getting API so need to make it async
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
        let data = await fetch(url) // 5. await data
        let result = await data.json() // 6. get data to json
        console.log("what's the result?",result) // 7. not showing up bc haven't called getCurrentWeather function yet
        this.setState({weatherResult:result}) // 12. call the constructor
        urlFrom = "geolocation";
    }

    getLocation = () => {
        navigator.geolocation.getCurrentPosition((post) => { // 1. "post" is just a random placeholder variable
            this.getCurrentWeather(post.coords.latitude, post.coords.longitude) // 2. we need to send "post.coords.longitude" & lat to "get current weather"
        }) // 3. send getLocation function to getCurrentWeather function => send 2 arguments (lat & long) inside getCurrentWeather
    }

    componentDidMount(){ // 8. call this  // 12.2 this will run second
        console.log("open app already")
        this.getLocation() // 9. call this because getCurrentWeather is already nested inside getLocation
    }

    getCity = async(city) => {
        let urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
        globalCity = city 
        let data = await fetch(urlCity)
        let result = await data.json()
        this.setState({weatherResult:result}) 
        urlFrom = "city"
    }

    changeTemp = async(value) => {

        let url = FC ? `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=imperial` : `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=metric`


        if(urlFrom === "geolocation"){
            let url = FC === true? `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=imperial` : `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=metric`
        }else if(urlFrom === "city"){
            let url = FC === true? `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${globalCity}&appid=${apiKey}&units=imperial`
        }

        FC = value 

        let data = await fetch(url)
        let result = await data.json()
        this.setState({weatherResult:result}) 
    }

    // getFiveDay = async(city) => {
    //     let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid={apiKey}&units=imperial`
    //     let data = await fetch(url)
    //     let result = await data.json()
    //     this.setState({weatherResult:result})
    // }



    render() { //12.1 this function will run first

        if(this.state.weatherResult == null){ // 13. this code: if weather result is null, do not show the content below, will only show "loading" => so data can be fetched
            return (<div className="sweet-loading">
            <ClipLoader
              css={override}
              size={150}
              color={"#74d185"}
              //loading={this.state.loading}
              loading={true} // everything not string type should go in curly brackets
            />
          </div>)
        }
        return (
            <>
            <Navbar bg="dark" variant="dark" className="navBarTop">
                <div> <a href="#" className="cityWeather" onClick={()=>this.getLocation()}>Home</a></div>
                <div> <a href="#" className="cityWeather" onClick={()=>this.getCity('Washington DC')}>Washington DC</a></div>
                <div> <a href="#" className="cityWeather" onClick={()=>this.getCity('Seoul')}>Seoul</a></div>
                <div> <a href="#" className="cityWeather" onClick={()=>this.getCity('Tokyo')}>Tokyo</a></div>
                <div> <a href="#" className="cityWeather" onClick={()=>this.getCity('New York')}>New York</a></div>
                <div> <a href="#" className="cityWeather" onClick={()=>this.getCity('London')}>London</a></div>
                <a href="#" className="cityWeather" onClick={()=>this.changeTemp(!FC)}>°F/°C</a>
            </Navbar>
            <div className="container-fluid text-white my-auto">
                <div className="container mx-auto my-4 py-4 main-weather">
                    <div className="row justify-content-center text-center">
                        <h1 className="col-12 display-4 my-2 py-3 text-success">Today's Weather</h1>
                        <h2 className="col-12">{this.state.weatherResult.name}</h2>
                        <h3 className="col-12 text-danger">{this.state.weatherResult.main.temp}</h3>
                        <h3 className="col-12">{this.state.weatherResult.weather[0].description}</h3> 
                        {/* <Button variant="secondary" className="currentWeather" style={{"margin-right":"20px"}} onClick={()=>this.getCurrentWeather()}>Current Weather</Button>
                        <Button variant="primary" className="fiveDayForecast" onClick={()=>this.getFiveDay()}>5 Day Forecast</Button> */}
                    </div>
                </div>
            </div>
            </>
        ) // 14. weather[0] because it's an array
    }
}

// 12.3 when we first run the code, the constructor comes first -> then render -> then componentDidMount
