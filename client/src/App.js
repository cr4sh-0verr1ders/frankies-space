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
      move: {
        up: false,
        left: false,
        down: false,
        right: false,
      }
    }
  }

  componentDidMount() {
    this.tickerID = setInterval(() => this.tick(), 25);
  }

  tick() {
    const { self, move } = this.state;
    this.setState({
      self: self.step(move.right - move.left, move.down - move.up),
    });
  }

  componentWillUnmount() {
    clearInterval(this.tickerID);
  }

  render() {
    const self = this.state.self;
    console.log(self);
    return (
      <div className="App">
        <Map x={self.x} y={self.y} />
      </div>
    );
  }
}

export default App;
