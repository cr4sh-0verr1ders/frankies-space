class User {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  step(dx, dy) {
    return new User(this.x + dx, this.y + dy);
  }
}

export { User };
