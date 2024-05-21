# TriviaTriviaTrivia

**TriviaTriviaTrivia** is an interactive online web app for playing trivia with your friends. 

The web app can be accessed over the internet at https://TriviaTriviaTrivia.com. 

Just press play—no account required.

## Getting Started
- Visit https://TriviaTriviaTrivia.com.
- Click the "Play Now" button to create a game room.
- To play with your friends, share the URL to your game room.
- Enter your display name, and press the "Join Game" button.
- Customize your match settings, and press the "Start Game" button when you (and your friends) are ready.
- A trivia question with answer choices will now be shown for a limited amount of time.
- Press the corresponding keyboard key for the answer you wish to select. (Press 1 for for answer choice 1).
- The answer will be revealed after time has elapsed and players will be judged.
- After all question rounds, a final score and rank will be given to players.
- You can choose to change settings, play again, or quit.

## Features

**TriviaTriviaTrivia** is currently still in development but supports basic multiplayer functionality and limited trivia match settings. For the final product, users will be able to: 

- [x] Play with their friends by creating a game room and sharing a link.
- [ ] Customize match settings.
  - [ ] Select from a variety of trivia question providers.
  - [ ] Customize the number of rounds.
  - [X] Customize the amount of points gained/lost on correct, incorrect, no answer responses.
  - [ ] Enable/Disable win streak bonuses and loss streak penalties.
  - [ ] Adjust the amount of time for each round.
- [ ] Add custom trivia questions.

## Project Background
- The primary purpose of this project was to gain experience in React and Express.
- The secondary purpose was to enable playing trivia with friends in real time without needing to download an app, create an account, or use a mobile device.
- This project, **TriviaTriviaTrivia**, was inspired by https://github.com/howardchung/jeopardy.

## Software Used
- Trivia Question Providers
  - Open Trivia DB (https://opentdb.com/).
- App
  - Frontend
    - Vite.
    - React.
    - Socket.IO (Client).
    - Mantine UI.
    - Storybook.
  - Backend
    - Express.js.
    - Socket.IO (Server).
    - esbuild.
- Deployment
  - Heroku.
