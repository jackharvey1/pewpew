[![Build Status](https://travis-ci.org/jackharvey1/pewpew.svg?branch=master)](https://travis-ci.org/jackharvey1/pewpew)
[![Coverage Status](https://coveralls.io/repos/github/jackharvey1/pewpew/badge.svg?branch=master)](https://coveralls.io/github/jackharvey1/pewpew?branch=master)

# What's this?
This is a 2D multiplayer deathmatch game utilising socket.io for server-client communication and Phaser to display the graphics with WebGL.

# Todo
## Features
- Allow users to select key configurations
- Improve map
  - Platforms

## Tech Debt
- Test coverage
- Use server time to improve synchronisation
- Merge `state.player` and `state.players` to improve code readability
- Can remove checks if player with id exists by fixing socket.io's issue with multiple connections
- Health doesn't need to be an class
- Clients are currently the source of truth on their position
