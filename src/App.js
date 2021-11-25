
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import './style/card.css';
import Navbar from "./components/Navbar";
import Shop from "./components/Shop";
import About from "./components/About";
import Warp from "./components/Warp";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


class App extends Component {

  render() {
    
  return (
    <Router>
    <div>
      
      <h1 className="justify-content-center warped">Warped Mentality</h1> 
      {/* <img src={warpedLogo} className="warped y-5"/> */}
     
    <Navbar />

    <Switch>
      <Route path="/about">
        <About/>
      </Route>
      <Route path="/$WARP">
        <Warp/>
      </Route>
      <Route path="/">
        <Shop/>
      </Route>
    </Switch>

    </div>
    </Router>
  );
  }
}

export default App;
