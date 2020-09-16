# REACT HOLD EM
A simple React-based app, with a Ruby on Rails backend, that allows a player to log in and out and play Hold 'Em against bots.

# How it Works
Players must either log in or create a new profile. Upon the successful creation of a profile/logging in with a preexisting username and password, the player is logged in via JWT authentication, and the initial screen appears.

Each player gets $500 at the start of a game.
Upon pressing "Start Game", the game begins. Standard Hold 'Em rules apply.

The player has four options:
  - Raise
  - Fold
  - Call
  - Check
  
Call and Fold are only available when the player's current bet is below the max bet.
  
The bots are currently configured to Call or Check each round; they will never raise or fold.

Each player's decision appears on the screen, in a text dialog box (e.g. "philivey raises by $5 to $15!"; "doylebrunson checks")
Throughout the round, each player's current bet and overall account balance (i.e. how much money they have with which to bet) appear onscreen next to their name. The cards are face-down at first, then are revealed face-up after the round.

After each round, the winner(s) gets their share of the pot added to their balance, and the next game begins.

Standard Hold 'Em rules apply

# YouTube Demo
Here is a brief demo showing off an early version of the App. More to come!
https://youtu.be/gCqOxp0iujw
