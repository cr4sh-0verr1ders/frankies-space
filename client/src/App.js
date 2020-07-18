import React, { Component } from 'react';
import mapBackground from './map.jpg';
import './App.css';
import { User, Avatar } from './User';
import MessageBox from './MessageBox';

const SPEED = 3;

function Map() {
  return (
    <img className="map" src={mapBackground}/>
  );
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      self: new User(3000, 2500),
      move: {
        up: false,
        left: false,
        down: false,
        right: false,
      }
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    this.tickerID = setInterval(() => this.tick(), 10);
  }

  tick() {
    const { self, move } = this.state;
    this.setState({
      self: self.step(
        SPEED * (move.right - move.left),
        SPEED * (move.down - move.up)
      ),
    });
  }

  componentWillUnmount() {
    clearInterval(this.tickerID);
  }

  setMove(newMove) {
    this.setState({
      ...this.state,
      move: {
        ...this.state.move,
        ...newMove,
      },
    });
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if(key === 'w') this.setMove({ up: true });
    if(key === 'a') this.setMove({ left: true });
    if(key === 's') this.setMove({ down: true });
    if(key === 'd') this.setMove({ right: true });
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if(key === 'w') this.setMove({ up: false });
    if(key === 'a') this.setMove({ left: false });
    if(key === 's') this.setMove({ down: false });
    if(key === 'd') this.setMove({ right: false });
  }

  render() {
    const self = this.state.self;
    const cssPosition = {
      "--origin-x": self.x,
      "--origin-y": self.y,
    };

    return (
      <div
        className="App"
        tabIndex="0" // Necessary to accept input
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        style={cssPosition}
      >
        <Map />
        <Avatar user={self} />
        <MessageBox />
      </div>
    );
  }
}

export default App;
