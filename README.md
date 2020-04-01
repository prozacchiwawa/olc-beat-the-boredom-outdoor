# Game

- It is almost star-raiders and almost jungle hunt.

- The longer your cities survive, the longer the game is.  The game ends either when you
  die or your last city runs out of population.
  
- Each map space is in a biome based on color.

- When a city falls to 0.5 population, 0.125 population is added to up to two other cities and
  the city falls to ruin.
- When two cities have 1.5 population, a new city is founded at 0.9 population.
- When you have one city and it achieves 2.0 population, a new city is founded at 0.8 
  population.

- Cities can be anywhere, you start with 4

- Travelling from one map space to the next involves randomly overcoming challenges based on
  the map:

  - Change in altitude
  - Source and destination biome
  - Units present
  
- When travelling, you may choose fast (hard) travel for reduced resource consumption but
  increased difficulty or slow (easier) travel.
  
- Passing a certain way has a chance to temporarily transform that square into a road.
- Roads next to other roads endure longer.
- Roads with traffic endure longer.

- Things displayed on the map if known:

  - Cities
  - Animals and animal packs
  - Bandits
  - Detected resources
  - Traders
  - Workers

    - Animal packs and bandits can attack cities
    - The player can fight them
    - The player can increase city defenses by finding resources and protecting workers
      heading to and from them

- Biomes:

  * ocean
  * beach
  * plains
  * savannah
  * forest
  * alpine
  * snowpack
  
- Biomes have weather patterns:

  * all biomes - clear, pokkari, rain, fog, storm
  * forest, alpine, snowpack - snowing

# Phases

- Add cities
- Add resources
- Add workers
- Add wolves

# Game play

- Map screen allows moving, has a menu around the player.  Pressing the action button
  switches between menu mode and movement mode.
  
- Menu mode puts menu items around the center of the screen in a cross, with the middle,
  "Return to map" in the center.
  
- Options are 'Stop Moving', 'Camp', 'Travel Fast [...]', 'Fight' if enemies apply

- Moving slowly has a chance of revealing very nearby resources.

- Fast travel does not reveal resources.

- Camping reveals nearby resources quickly.

- Move mode puts a cursor and dots on the screen and the cursor blinks.  You move the cursor
  and set a location, after which there's a blinking move target.

# Build
```
npm run build
```

# Watch

```
npm run watch
```


# Editor
If you use `vscode`, Press `Windows + Shift + B` it will build automatically
