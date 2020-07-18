import React, { Component } from 'react';
import logo from './map.jpg';
import './App.css';
import { User } from './User';

function Map(props) {
  const styles = {
    "--x": props.x,
    "--y": props.y,
  };

  return (
    <img className="map" style={styles} src={logo}/>
  );
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      self: new User(),
    }
  }

  render() {
    const self = this.state.self;
    return (
      <div className="App">
        <Map x={self.x} y={self.y} />
      </div>
    );
  }
}

export default App;
