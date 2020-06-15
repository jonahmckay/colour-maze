"use strict";

Pizzicato.volume = 0;
// directions: [N, E, S, W]

const MAZE_WIDTH = 18;
const MAZE_HEIGHT = 18;
//constants representing difference in position based on
//direction ID
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

//Quadrant shifts from 0, 0 as top left quadrant to 1, 1 as bottom right
const QDX = [0, 1, 1, 0];
const QDY = [0, 0, 1, 1];

//Cosntant to get the opposite of a direction based on its ID
const OPPOSITE = [2, 3, 0, 1];

//anchor values for relative positioning
const ANCHORS = [
  "absolute",
  "top-left",
  "left",
  "bottom-left",
  "top-right",
  "right",
  "bottom-right",
  "top",
  "bottom",
  "center"
];

const WALL_TILES = [
  "-wall.png",
  "e-wall.png",
  "es-wall.png",
  "esw-wall.png",
  "ew-wall.png",
  "n-wall.png",
  "ne-wall.png",
  "nes-wall.png",
  "nesw-wall.png",
  "new-wall.png",
  "ns-wall.png",
  "nsw-wall.png",
  "nw-wall.png",
  "s-wall.png",
  "sw-wall.png",
  "w-wall.png"
];

//Helper function, shuffles an array.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class SupporterZone
{
  constructor(x, y, w, h)
  {
    this.width = w;
    this.height = h;
    this.xPos = x;
    this.yPos = y;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.elements = [];
  }
  setSize(x, y)
  {
    this.width = x;
    this.height = y;

    this.canvas.width = x;
    this.canvas.height = y;
  }
  setPosition(x, y)
  {
    this.xPos = x;
    this.yPos = y;
  }
  addOverlayElement(element)
  {
    this.elements.push(element)
  }
  drawToContext(ctx, x, y)
  {
    for (let i = 0; i < this.elements.length; i++)
    {
      let imagePosition = this.elements[i].positionFromAnchor(this.width, this.height);
      imagePosition[0] += this.xPos;
      imagePosition[1] += this.yPos;
      ctx.drawImage(this.elements[i].getImage(), imagePosition[0], imagePosition[1], this.elements[i].width, this.elements[i].height);
    }
  }
}

//for displaying animations and HUD elements

class OverlayElement
{
  constructor(asset)
  {
    this.xOffset = 0;
    this.yOffset = 0;
    this.asset = asset;
    this.width;
    this.height;
    this.anchor = "absolute";
    if (this.asset.frames !== undefined)
    {
      this.animation = new Animation();
      this.animation.startTime = game.renderer.renderTick;
      this.animation.frameCount = this.asset.frames.length;
      this.width = this.asset.width;
      this.height = this.asset.height;
    }
    else
    {
      this.width = this.asset.image.width;
      this.height = this.asset.image.height;
    }
  }

  getImage()
  {
    //assume is an animatedasset
    if (this.animation !== undefined)
    {
      return this.asset.frames[this.animation.getCurrentFrame(game.renderer.renderTick)];
    }
    else
    {
      return this.asset.image;
    }
  }

  getAspectRatio()
  {
    return this.width/this.height;
  }

  setRelativeSize(canvasWidth, canvasHeight, maximumOfDimension, aspectRatio)
  {
    if (aspectRatio === undefined)
    {
      let aspectRatio = this.width/this.height;
    }

    let canvasRatio = canvasWidth/canvasHeight;

    let smallestCanvasAxis;

    if (canvasRatio > 1)
    {
      smallestCanvasAxis = canvasWidth;
    }
    else
    {
      smallestCanvasAxis = canvasHeight;
    }

    let longestSide = maximumOfDimension*smallestCanvasAxis;

    let newX;
    let newY;

    if (aspectRatio > 1)
    {
      newX = longestSide;
      newY = longestSide*(1/aspectRatio);
    }
    else
    {
      newX = longestSide*aspectRatio;
      newY = longestSide;
    }

    newX = Math.floor(newX);
    newY = Math.floor(newY);

    this.width = newX;
    this.height = newY;
  }

  positionFromAnchor(width, height)
  {
    let position;
    switch (this.anchor)
    {
      case "absolute":
        position = [this.xOffset, this.yOffset];
        break;
      case "top-left":
        position = [this.xOffset, this.yOffset];
        break;
      case "left":
        position = [this.xOffset, this.yOffset+Math.floor((height/2)-(this.height/2))];
        break;
      case "bottom-left":
        position = [this.xOffset, this.yOffset+Math.floor((height)-(this.height))];
        break;
      case "top-right":
        position = [this.xOffset+Math.floor((width)-(this.width)), this.yOffset];
        break;
      case "right":
        position = [this.xOffset+Math.floor((width)-(this.width)), this.yOffset+Math.floor((height/2)-(this.height/2))];
        break;
      case "bottom-right":
        position = [this.xOffset+Math.floor((width)-(this.width)), this.yOffset+Math.floor((height)-(this.height))];
        break;
      case "top":
        position = [this.xOffset+Math.floor((width/2)-(this.width/2)), this.yOffset];
        break;
      case "bottom":
        position = [this.xOffset+Math.floor((width/2)-(this.width/2)), this.yOffset+Math.floor((height)-(this.height))];
        break;
      case "center":
        position = [this.xOffset+Math.floor((width/2)-(this.width/2)), this.yOffset+Math.floor((height/2)-(this.height/2))];
        break;
    }
    return position;
  }
}

class SoundPlayer
{
  constructor()
  {

  }
}

//class which represents a modifiable colour value
class Colour
{
  constructor(h, s, l)
  {
    //hue: 0-360, saturation: 0-100, luminance: 0-100
    this.h = h;
    this.s = s;
    this.l = l;
    this.string = `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}

//Increments every game tick in the Game class. Has multiple subclasses
//for specific usecases.
class Animation
{
  constructor()
  {
    this.currentFrame = 0;
    this.startTime = 0;
    this.frameCount = null;
    this.timeDivider = 1;
  }

  nextFrame()
  {
    this.currentFrame++;
    if (this.currentFrame >= this.frameCount)
    {
      this.currentFrame = 0;
    }
  }

  getCurrentFrame(currentTime)
  {
    let frame = Math.floor((currentTime - this.startTime)/this.timeDivider) % this.frameCount;
    return frame;
  }
}

//Allows you to make an a rotation animation
class RotationAnimation extends Animation
{
  constructor()
  {
    super(Animation);
    this.clockwise = true;

  }

  //Gets the current angle of the animation, in radians.
  getAngle(currentTime)
  {
    let angle = (Math.PI*2)*(this.getCurrentFrame(currentTime)/(this.frameCount-1));
    if (!this.clockwise)
    {
      angle = -angle;
    }
    return angle;
  }
}

class ValueAnimation extends Animation
{
  constructor()
  {
    super(Animation);
    this.startValue = 0;
    this.endValue = 255;
    this.valueDifference = startValue-endValue;
  }

  getValue()
  {
    let value = this.startValue + (this.valueDifference*(this.currentFrame/(this.frameCount-1)));
    return value;
  }
}

//Layer class, drawn each frame. Essentially a wrapper for an HTML5 canvas
//and a position offset.
class Layer
{
  constructor(xPos, yPos, xSize, ySize)
  {
    this.xPos = xPos;
    this.yPos = yPos;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.setSize(xSize, ySize);
  }

  setSize(x, y)
  {
    this.canvas.width = x;
    this.canvas.height = y;
  }

  setPosition(x, y)
  {
    this.xPos = x;
    this.yPos = y;
  }

  clear()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

//TODO: make this better, beginnings of a particle system
class Particle
{
  constructor()
  {
    this.xPos = 0;
    this.yPos = 0;
    this.size = 0;
    this.colour = null;
  }
  displayParticle(ctx)
  {

  }
}

class DisplayElement
{
  constructor()
  {
    this.xPos = 0;
    this.yPos = 0;
    this.layer = "standard";
  }
}

class Trail
{
  constructor()
  {
    this.nodes = [];
    this.maxLength = 10;
  }

  addNode(node)
  {
    if (this.nodes.length >= this.maxLength)
    {
      while (this.nodes.length >= this.maxLength)
      {
        this.nodes.shift();
      }
    }
    this.nodes.push(node);
  }

  displayTrail(layer)
  {
    layer.ctx.lineWidth = 20;
    for (let i = 0; i < this.nodes.length-1; i++)
    {
      let n1 = this.nodes[i];
      let n2 = this.nodes[i+1];
      let gradient = layer.ctx.createLinearGradient(n1.xPos, n1.yPos, n2.xPos, n2.yPos);
      gradient.addColorStop("0", n1.colour);
      gradient.addColorStop("1", n2.colour);
      layer.ctx.strokeStyle = gradient;

      layer.ctx.beginPath();
      layer.ctx.moveTo(n1.xPos, n1.yPos);
      layer.ctx.lineTo(n2.xPos, n2.yPos);
      layer.ctx.stroke();
    }
  }
}

class TrailNode
{
  constructor(x, y)
  {
    this.xPos = x;
    this.yPos = y;
    this.colour = "#666666";
  }
}

//Stores information about the player, including their position and movement.
//Has path finding and movement functions.
class Player
{
  constructor()
  {
    this.xPos = 0;
    this.yPos = 0;
    this.currentQuadrant = 0;

    this.playerTrail = new Trail();

    this.currentPath = [];
    this.moving = false;
    this.moveSubstep = 0;
    this.moveIncrement = 0.5;
  }

  //Starts a pathfinding sequence in the direction given.
  moveInDirection(maze, direction)
  {
     if (!maze.grid[this.xPos][this.yPos].walls[direction])
     {

      let nextX = this.xPos + DX[direction];
      let nextY = this.yPos + DY[direction];

      this.moving = true;
      this.moveSubstep = 0;
      let path = [[this.xPos, this.yPos], [nextX, nextY]];
      this.currentPath = this.makeMovementPath(this.xPos, this.yPos, nextX, nextY, direction, maze, path);
     }
  }

  makeMovementPath(lastX, lastY, currentX, currentY, direction, maze, path)
  {
    let pathToTake = -1;
    let intersection = false;
    for (let i = 0; i < maze.grid[currentX][currentY].walls.length; i++)
    {
      if (!maze.grid[currentX][currentY].walls[i] && i != OPPOSITE[direction])
      {
        if (pathToTake === -1)
        {
          pathToTake = i;
        }
        else
        {
          intersection = true;
        }
      }
    }

    if (pathToTake != -1 && !intersection)
    {
      let nextX = currentX+DX[pathToTake];
      let nextY = currentY+DY[pathToTake];
      path.push([nextX, nextY]);
      this.makeMovementPath(currentX, currentY, nextX, nextY, pathToTake, maze, path);
    }
    return path;
  }

  updateMovement(maze)
  {
    if (this.moving)
    {
      this.moveSubstep += this.moveIncrement;
      if (this.moveSubstep >= 0.98)
      {
        this.xPos = this.currentPath[0][0];
        this.yPos = this.currentPath[0][1];
        this.moveSubstep = this.moveSubstep-1;

        //NOTE: pretty hacky, uses global game variable
        let blockWidth = game.renderer.blockWidth;
        let blockHeight = game.renderer.blockHeight;

        let trailNode = new TrailNode((this.xPos*blockWidth)+(blockWidth/2), (this.yPos*blockHeight)+(blockHeight/2));
        this.playerTrail.addNode(trailNode);

        if (this.currentPath.length > 1)
        {
          this.currentPath.shift();
          let currentBlock = maze.grid[this.xPos][this.yPos];
          if (currentBlock.walls[this.currentPath[0]])
          {
            this.currentPath = [];
            this.moving = false;
          }
        }
        else
        {
          this.moving = false;
        }
      }
    }
  }

  movePosition(maze, x, y)
  {
    this.xPos += x;
    this.yPos += y;
    this.currentQuadrant = maze.getPositionQuadrant(x, y);
  }
}

//???
class MovementPath
{
  constructor()
  {
    this.path = [];
  }
}

//Game function.
class Game
{
  constructor()
  {
    this.state = "menu";

    this.generator = undefined;
    this.player = new Player();
    this.currentMaze = new Maze(MAZE_WIDTH, MAZE_HEIGHT);

    this.quadrants = [new Quadrant(), new Quadrant(), new Quadrant(), new Quadrant()];

    //primary colours for quadrants, full sets in this.quadrants
    this.quadrantColourSets = []
    this.generateNewColourSet();

    //ids for using from quadrantColourSets
    this.currentQuadrantLevels = [-1, -1, -1, -1];

    this.gameTime = 0;
    this.quadrantsVisited = [false, false, false, false];
    this.quadrantsRegenerated = [true, true, true, true];
    this.currentQuadrant = 0;
    this.renderer = new GameRenderer();
    this.gameLoaded = false;

  }

  //Runs every game tick (arbitrary value, currently every 1/20 seconds)
  //TODO: Maybe updating each frame would be smarter, and using the
  //returned time stamp to determine time passed to avoid framerate changing
  //game speed?

  gameLoop()
  {
    if (this.state === "game")
    {
      this.player.updateMovement(this.currentMaze);
      if (this.currentMaze.getPositionQuadrant(this.player.xPos, this.player.yPos) !== this.currentQuadrant)
      {
        this.currentQuadrant = this.currentMaze.getPositionQuadrant(this.player.xPos, this.player.yPos);
        this.quadrantsVisited[this.currentQuadrant] = true;
        this.quadrantsRegenerated[this.currentQuadrant] = false;
        let oppositeQuadrant = (this.currentQuadrant+2)%4;
        if (!this.quadrantsRegenerated[oppositeQuadrant])
        {
          this.generator.quadrants[oppositeQuadrant] = this.generator.generateQuadrant(oppositeQuadrant);
          this.currentMaze.grid = this.generator.stitchQuadrants(this.generator.quadrants);
          this.quadrantsRegenerated[oppositeQuadrant] = true;
          this.quadrantsVisited[oppositeQuadrant] = false;
          this.replaceQuadrantData(oppositeQuadrant);
        }
      }
      this.gameTime++;
    }
    else if (this.state === "menu")
    {
      if (this.renderer.assetsLoaded())
      {
        this.initializeQuadrantData();
        this.initializeOverlayData();
        this.startSong();
        this.randomizePlayerStartPosition();
        this.gameLoaded = true;
        this.state = "game";
      }
    }
  }

  startSong()
  {
    this.renderer.assets.getAsset("song").sound.loop = true;
    this.renderer.assets.getAsset("song").sound.play();
  }

  randomizePlayerStartPosition()
  {
    this.player.xPos = Math.round(Math.random())*(this.currentMaze.width-1);
    this.player.yPos = Math.round(Math.random())*(this.currentMaze.height-1);
  }
  initializeOverlayData()
  {
    let wheel = new OverlayElement(this.renderer.assets.getAsset("colourwheel"));
    wheel.animation.timeDivider = 4;
    this.renderer.supporterZones["C0"].addOverlayElement(wheel);
  }

  generateNewColourSet()
  {
    let set = [];
    let baseHue = Math.floor(Math.random()*360);
    let hueDeviance = Math.floor(Math.random()*10)+70;

    let baseSaturation = 100;
    let baseLuminance = 50;

    let baseColour = new Colour(baseHue, baseSaturation, baseLuminance);
    set.push(baseColour);
    set.push(new Colour((baseHue+hueDeviance)%360, baseSaturation, baseLuminance));
    set.push(new Colour((set[0].h+180)%360, baseSaturation, baseLuminance));
    set.push(new Colour((set[1].h+180)%360, baseSaturation, baseLuminance));

    this.quadrantColourSets.push(set);
  }

  generateTriadFromColour(colour)
  {
    let set = [];
    set.push(colour);
    set.push(new Colour((colour.h+120)%360, colour.s, colour.l));
    set.push(new Colour((colour.h+240)%360, colour.s, colour.l));
    return set;
  }

  replaceQuadrantData(quadrant)
  {

    if (this.currentQuadrantLevels[quadrant] >= this.quadrantColourSets.length-1)
    {
      this.generateNewColourSet();
    }

    this.currentQuadrantLevels[quadrant]++;

    let currentLevel = this.currentQuadrantLevels[quadrant];
    let newQuadrant = new Quadrant();
    let primaryColour = this.quadrantColourSets[currentLevel][quadrant];
    let triad = this.generateTriadFromColour(primaryColour);

    newQuadrant.colours = [];

    for (let i = 0; i < triad.length; i++)
    {
      newQuadrant.colours.push(triad[i]);
    }
    let assetName = `quad${quadrant}`;
    newQuadrant.cacheBackgroundFromAsset(this.renderer.assets.getAsset(assetName));
    this.quadrants[quadrant] = newQuadrant;
  }

  initializeQuadrantData()
  {
    this.currentQuadrantLevels = [-1, -1, -1, -1];
    for (let i = 0; i <= 3; i++)
    {
      this.replaceQuadrantData(i);
    }
  }

  //Function run when a button event occurs.
  buttonPressed(e)
  {
    this.renderer.updateFrame = true;

    if (!this.player.moving)
    {
      if (e.key === 's')
      {
        //this.player.moveToNextDecision(this.player.xPos, this.player.yPos, this.player.xPos, this.player.yPos+1, 2, this.maze, []);
        this.player.moveInDirection(this.currentMaze, 2);
      }
      else if (e.key === 'w')
      {
        //this.player.moveToNextDecision(this.player.xPos, this.player.yPos, this.player.xPos, this.player.yPos-1, 0, this.maze, []);
        this.player.moveInDirection(this.currentMaze, 0);
      }
      else if (e.key === 'a')
      {
      //  this.player.moveToNextDecision(this.player.xPos, this.player.yPos, this.player.xPos-1, this.player.yPos, 3, this.maze, []);
        this.player.moveInDirection(this.currentMaze, 3);
      }
      else if (e.key === 'd')
      {
        //this.player.moveToNextDecision(this.player.xPos, this.player.yPos, this.player.xPos+1, this.player.yPos, 1, this.maze, []);
        this.player.moveInDirection(this.currentMaze, 1);
      }
    }
    if (e.key === 't')
    {
      this.player.moveIncrement += 0.1;
    }
    else if (e.key === 'g')
    {
      this.player.moveIncrement -= 0.1;
      if (this.player.moveIncrement < 0.1)
      {
        this.player.moveIncrement = 0.1;
      }
    }
  }
}

//Represents a block in the maze.
class Block
{
  constructor()
  {
    this.walls = [true, true, true, true];
    this.visited = false;
    this.dead = false;
  }
}

//stores quadrant data, themes, colours
class Quadrant
{
  constructor()
  {
    let colours = [];
    let backgroundImage = null;
  }
  cacheBackgroundFromAsset(asset)
  {
    let image = asset.image;
    let imgCanvas = document.createElement('canvas');
    let tintCanvas = document.createElement('canvas');

    imgCanvas.width = image.width;
    imgCanvas.height = image.height;
    tintCanvas.width = image.width;
    tintCanvas.height = image.height;

    let i_ctx = imgCanvas.getContext('2d');
    let t_ctx = tintCanvas.getContext('2d');

    i_ctx.drawImage(image, 0, 0, image.width, image.height);
    t_ctx.fillStyle = this.colours[0].string;
    t_ctx.fillRect(0, 0, image.width, image.height);

    this.backgroundImage = document.createElement('canvas');

    this.backgroundImage.width = image.width;
    this.backgroundImage.height = image.height;

    let b_ctx = this.backgroundImage.getContext('2d');

    b_ctx.drawImage(imgCanvas, 0, 0, image.width, image.height);
    b_ctx.globalCompositeOperation = "color";
    b_ctx.drawImage(tintCanvas, 0, 0, image.width, image.height);
  }
}


//Represents the maze.
class Maze
{
  constructor(width, height, quadrant)
  {
    this.width = width;
    this.height = height;

    //"deadSize" is the size of the deadspace in the middle.
    this.deadSize = 6;

    //grid is a 2 dimensional array of Block objects.
    this.grid = [];
    if (quadrant === undefined)
    {
      this.initialize();
    }
    else
    {
      this.initializeAsQuadrant(quadrant);
    }
  }

  initialize()
  {
    //Populate the grid matrix with Blocks, and make the appropriate space in the
    //middle "dead"
    for (let x = 0; x < this.width; x++)
    {
      this.grid.push([]);
      for (let y = 0; y < this.height; y++)
      {
        this.grid[x].push(new Block());
        if ((x < Math.floor(this.deadSize/2)+Math.floor(this.width/2) && x >= (this.width/2)-Math.floor(this.deadSize/2)) &&
            (y < Math.floor(this.deadSize/2)+Math.floor(this.height/2) && y >= (this.height/2)-Math.floor(this.deadSize/2)) )
            {
              this.grid[x][y].dead = true;
            }
      }
    }
  }

  initializeAsQuadrant(quadrant)
  {
    for (let x = 0; x < this.width; x++)
    {
      this.grid.push([]);

      for (let y = 0; y < this.height; y++)
      {
        let adjustedX = (this.width*QDX[quadrant])+x;
        let adjustedY = (this.height*QDY[quadrant])+y;
        this.grid[x].push(new Block());
        if ((adjustedX < Math.floor(this.deadSize/2)+Math.floor(this.width) && adjustedX >= (this.width)-Math.floor(this.deadSize/2)) &&
            (adjustedY < Math.floor(this.deadSize/2)+Math.floor(this.height) && adjustedY >= (this.height)-Math.floor(this.deadSize/2)) )
            {
              this.grid[x][y].dead = true;
            }
      }
    }
  }

  //Gets the quadrant of any given x/y position in the maze
  getPositionQuadrant(x, y)
  {
    //Quadrants clockwise from a 0 top-left
    let top = null;
    let left = null;

    if (y < Math.floor(this.width/2))
    {
      top = true;
    }
    else
    {
      top = false;
    }

    if (x < Math.floor(this.height/2))
    {
      left = true;
    }
    else
    {
      left = false;
    }

    let quadrant = 0;

    if (top && left)
    {
      quadrant = 0;
    }
    else if (top && !left)
    {
      quadrant = 1;
    }
    else if (!top && !left)
    {
      quadrant = 2;
    }
    else if (!top && left)
    {
      quadrant = 3;
    }

    return quadrant;
  }
}

//An asset is a wrapper around an image that avoids issues with using images
//before they've loaded. Used with AssetLibrary objects.
class Asset
{
  constructor(url, onload)
  {
    this.image = new Image();
    this.image.onload = function () { onload(); this.loaded = true; }.bind(this);
    this.loaded = false;
    this.image.src = url;
  }
}

//AnimatedAssets are Assets that automatically read spritesheet images (horizontal) as individual
//frames and stores them for use in its .frames property.
class AnimatedAsset
{
  constructor(url, onload, width, height)
  {
    //combine the given onload function with one that also makes frames from the
    //given image.
    let onloadfunction = function () {onload(); this.makeFrames(); this.loaded = true;}.bind(this);

    this.image = new Image();
    this.image.onload = onloadfunction;
    this.image.src = url;
    this.loaded = false;
    this.width = width;
    this.height = height;
    this.frames = [];
  }

  //On load, read this asset's image as a sprite sheet, and store the images in
  //this.frames.
  makeFrames(img, width, height)
  {
    let frameCount = Math.floor(this.image.width/this.width);
    for (let i = 0; i < frameCount; i++)
    {
      let frame = document.createElement("canvas");
      let ctx = frame.getContext("2d");
      frame.width = this.width;
      frame.height = this.height;
      ctx.drawImage(this.image, i*this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
      this.frames.push(frame);
    }
  }
}

class SoundAsset
{
  constructor(url, onload)
  {
    this.sound = new Pizzicato.Sound(url, function ()
    {
      this.loaded = true;
      onload();
    }.bind(this));
    this.loaded = false;
  }
}

//Used to give names to images and sprite animations. Lets you check to see if an
//asset is fully loaded before use.
class AssetLibrary
{
  constructor()
  {
    this.assets = {};
    this.loadingAssets = [];
  }

  addAsset(name, url)
  {
    let asset = new Asset(url, function() { this.assetLoaded(name) }.bind(this));
    this.assets[name] = asset;
    this.loadingAssets.push(name);
  }

  addSoundAsset(name, url)
  {
    let asset = new SoundAsset(url, function() { this.assetLoaded(name) }.bind(this));
    this.assets[name] = asset;
    this.loadingAssets.push(name);
  }

  addAnimatedAsset(name, url, width, height)
  {
    let asset = new AnimatedAsset(url, function() { this.assetLoaded(name) }.bind(this), width, height);
    this.assets[name] = asset;
    this.loadingAssets.push(name);
  }

  assetLoaded(name)
  {
    for (let i = 0; i < this.loadingAssets.length; i++)
    {
      if (this.loadingAssets[i] === name)
      {
        this.loadingAssets.splice(i, 1);
        break;
      }
    }
  }

  getAsset(name)
  {
    return this.assets[name];
  }
}

//Class that handles the display of the game. Loooooong.
class GameRenderer
{
    constructor()
    {
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.renderTick = 0;

      this.blockWidth = 30;
      this.blockHeight = 30;

      this.wallTexture = document.getElementById("wallTex");
      this.updateFrame = true;

      this.loadedWallTiles = new AssetLibrary();
      this.characterSprites = new AssetLibrary();

      // this.canvasWidth = window.innerWidth;
      // this.canvasHeight = window.innerHeight;

      this.marginMinimum = 150;

      this.squareWidthOffset = Math.floor(Math.abs(Math.min(this.marginMinimum, this.canvasWidth-this.canvasHeight))/2);
      this.squareHeightOffset = Math.floor(Math.abs(Math.min(this.marginMinimum, this.canvasHeight-this.canvasWidth))/2);
      this.canvasSquareSize = Math.min(this.canvasWidth, this.canvasHeight)-(this.marginMinimum*2);

      this.layers = {};

      this.addLayer("standard", 0, 0,
      window.innerWidth, window.innerHeight);
      this.addLayer("maze", this.squareWidthOffset, this.squareHeightOffset,
      this.canvasSquareSize, this.canvasSquareSize);
      this.addLayer("mazeBackground", this.squareWidthOffset, this.squareHeightOffset,
      this.canvasSquareSize, this.canvasSquareSize);
      this.addLayer("mazeTexture", this.squareWidthOffset, this.squareHeightOffset,
      this.canvasSquareSize, this.canvasSquareSize);
      this.addLayer("character", 0, 0,
      window.innerWidth, window.innerHeight);
      this.addLayer("deadSpace", 0, 0,
      this.canvasSquareSize, this.canvasSquareSize);
      this.addLayer("mazeParticles", this.squareWidthOffset, this.squareHeightOffset,
      this.canvasSquareSize, this.canvasSquareSize);
      this.addLayer("supporters", 0, 0,
      window.innerWidth, window.innerHeight);

      this.layerOrder = ["standard", "mazeParticles", "supporters"];

      this.assets = new AssetLibrary();
      this.assets.addAsset("background", "imgs/background.jpg");

      let deadspaceAnimation = new Animation();
      deadspaceAnimation.frameCount = 44;

      this.assets.addAnimatedAsset("deadspacechar1", "imgs/deadspace/deadspaceanimation1.png", 256, 248);

      this.assets.addAnimatedAsset("charactersheet", "imgs/character/characteranimation.png", 256, 256);
      this.assets.addAnimatedAsset("colourwheel", "imgs/box.png", 256, 256);

      this.activeSheets = {};

      this.sheetsLoaded = false;

      this.animations = {};

      this.supporterZones = {};

      let characterAnimation = new Animation();
      characterAnimation.frameCount = 296;
      this.addAnimation("character", characterAnimation);
      this.addAnimation("deadspace", deadspaceAnimation);

      for (let i = 0; i < WALL_TILES.length; i++)
      {
        let tileName = WALL_TILES[i];
        let tileSrc = `imgs/tiles/${tileName}`;
        this.assets.addAsset(tileName, tileSrc);
      }

      this.assets.addAsset("character", "imgs/character/character.png");
      this.assets.addAsset("quadrantbackground", "imgs/quadrantbackground.png");

      this.assets.addAsset("quad0", "imgs/quads/quad0.png");
      this.assets.addAsset("quad1", "imgs/quads/quad1.png");
      this.assets.addAsset("quad2", "imgs/quads/quad2.png");
      this.assets.addAsset("quad3", "imgs/quads/quad3.png");

      this.assets.addSoundAsset("song", "sounds/coloursongremix.mp3");

      this.scaleLayers();
      this.initializeSupporterZones();
    }

    initializeSupporterZones()
    {
      this.supporterZones["S0"] = new SupporterZone(0, 0, 0, 0);
      this.supporterZones["S1"] = new SupporterZone(0, 0, 0, 0);

      this.supporterZones["B0"] = new SupporterZone(0, 0, 0, 0);
      this.supporterZones["B1"] = new SupporterZone(0, 0, 0, 0);

      this.supporterZones["C0"] = new SupporterZone(0, 0, 0, 0);

      this.calculateSupporterZones();
    }

    calculateSupporterZones()
    {
      if (this.squareWidthOffset > this.squareHeightOffset)
      {
        this.supporterZones["S0"].setSize(this.canvasSquareSize, this.squareHeightOffset);
        this.supporterZones["S0"].setPosition(this.squareWidthOffset, 0);
        this.supporterZones["S1"].setSize(this.canvasSquareSize, this.squareHeightOffset);
        this.supporterZones["S1"].setPosition(this.squareWidthOffset, this.squareHeightOffset+this.canvasSquareSize);
        this.supporterZones["B0"].setSize(this.squareWidthOffset, this.canvas.height);
        this.supporterZones["B0"].setPosition(0, 0);
        this.supporterZones["B1"].setSize(this.squareWidthOffset, this.canvas.height);
        this.supporterZones["B1"].setPosition(this.squareWidthOffset+this.canvasSquareSize, 0);

        this.supporterZones["C0"].setPosition(this.squareWidthOffset-(this.marginMinimum/2), 0);
      }
      else
      {
        this.supporterZones["S0"].setSize(this.squareWidthOffset, this.canvasSquareSize);
        this.supporterZones["S0"].setPosition(0, this.squareHeightOffset);
        this.supporterZones["S1"].setSize(this.squareWidthOffset, this.canvasSquareSize);
        this.supporterZones["S1"].setPosition(this.squareWidthOffset+this.canvasSquareSize, this.squareHeightOffset);
        this.supporterZones["B0"].setSize(this.canvas.width, this.squareHeightOffset);
        this.supporterZones["B0"].setPosition(0, 0);
        this.supporterZones["B1"].setSize(this.canvas.width, this.squareHeightOffset);
        this.supporterZones["B1"].setPosition(0, this.squareHeightOffset+this.canvasSquareSize);

        this.supporterZones["C0"].setPosition(0, this.squareHeightOffset-(this.marginMinimum/2));
      }
      this.supporterZones["C0"].setSize(this.canvasSquareSize+(this.marginMinimum), this.canvasSquareSize+(this.marginMinimum));
    }

    assetsLoaded()
    {
      return this.assets.loadingAssets.length === 0;
    }

    addLayer(name, xPos, yPos, xSize, ySize)
    {
        let layer = new Layer(xPos, yPos, xSize, ySize);
        this.layers[name] = layer;
    }

    drawLayer(layer)
    {
      this.ctx.drawImage(layer.canvas, layer.xPos, layer.yPos, layer.canvas.width, layer.canvas.height);
    }

    clearAllLayers()
    {
      for (let i = 0; i < this.layerOrder.length; i++)
      {
        this.layers[this.layerOrder[i]].clear();
      }
    }

    addAnimation(name, animation)
    {
        this.animations[name] = animation;
    }

    scaleLayers()
    {
      if (this.canvasWidth !== window.innerWidth || this.canvasHeight !== window.innerHeight)
      {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;

        this.squareWidthOffset = Math.floor((Math.max(0, this.canvasWidth-this.canvasHeight)+this.marginMinimum)/2);
        this.squareHeightOffset = Math.floor((Math.max(0, this.canvasHeight-this.canvasWidth)+this.marginMinimum)/2);
        this.canvasSquareSize = Math.min(this.canvasWidth, this.canvasHeight)-(this.marginMinimum);

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.layers["standard"].setSize(this.canvasWidth, this.canvasHeight);
        this.layers["supporters"].setSize(this.canvasWidth, this.canvasHeight);
        this.layers["maze"].setSize(this.canvasSquareSize, this.canvasSquareSize);
        this.layers["maze"].setPosition(this.squareWidthOffset, this.squareHeightOffset);
        this.layers["mazeTexture"].setSize(this.canvasSquareSize, this.canvasSquareSize);
        this.layers["mazeTexture"].setPosition(this.squareWidthOffset, this.squareHeightOffset);
        this.layers["character"].setSize(this.blockWidth, this.blockHeight);
        this.layers["deadSpace"].setSize(this.canvasSquareSize, this.canvasSquareSize);
        this.layers["deadSpace"].setPosition(this.squareWidthOffset, this.squareHeightOffset);
        this.layers["mazeParticles"].setSize(this.canvasSquareSize, this.canvasSquareSize);
        this.layers["mazeParticles"].setPosition(this.squareWidthOffset, this.squareHeightOffset);
        this.layers["mazeBackground"].setSize(this.canvasSquareSize, this.canvasSquareSize);
        this.layers["mazeBackground"].setPosition(this.squareWidthOffset, this.squareHeightOffset);
        if (this.supporterZones["B0"] !== undefined)
        {
        this.calculateSupporterZones();
        }
      }
    }
    resizeCanvas(context, width, height)
    {
      context.canvas.width = width;
      context.canvas.height = height;
    }

    renderLoop(game)
    {
      this.scaleLayers();
      this.clearAllLayers();

      if (game.state === "game")
      {

        if (this.updateFrame && this.assetsLoaded())
        {

          this.displayBackground();
          this.displayMaze(game.currentMaze, game);
          this.displayCharacter(game);
        }

        for (let i = 0; i < Object.keys(this.animations).length; i++)
        {
          this.animations[Object.keys(this.animations)[i]].nextFrame();
        }

        this.displayDeadspace(game);

      }
      else if (game.state === "menu")
      {
        this.displayMenu(game);
      }

      this.displaySupporters(game);
      for (let i = 0; i < this.layerOrder.length; i++)
      {
        this.drawLayer(this.layers[this.layerOrder[i]]);
      }

      window.requestAnimationFrame(function () { this.renderLoop(game); }.bind(game.renderer));

      this.renderTick++;
    }

    displaySupporters(game)
    {
      // let zone = this.supporterZones["S0"];
      // this.layers["supporters"].ctx.fillStyle = "#FF0000";
      // this.layers["supporters"].ctx.fillRect(zone.xPos, zone.yPos, zone.width, zone.height);
      // this.layers["supporters"].ctx.fillStyle = "#00FFFF";
      // zone = this.supporterZones["S1"];
      // this.layers["supporters"].ctx.fillRect(zone.xPos, zone.yPos, zone.width, zone.height);
      // this.layers["supporters"].ctx.fillStyle = "#00FF00";
      // zone = this.supporterZones["B0"];
      // this.layers["supporters"].ctx.fillRect(zone.xPos, zone.yPos, zone.width, zone.height);
      // this.layers["supporters"].ctx.fillStyle = "#0000FF";
      // zone = this.supporterZones["B1"];
      // this.layers["supporters"].ctx.fillRect(zone.xPos, zone.yPos, zone.width, zone.height);

      for (let i = 0; i < Object.keys(this.supporterZones).length; i++)
      {
        let zone = this.supporterZones[Object.keys(this.supporterZones)[i]];
        zone.drawToContext(this.layers["supporters"].ctx, 0, 0);
      }
    }

    displayMenu(game)
    {

    }

    displayDeadspace(game)
    {
      if (this.assets.getAsset("deadspacechar1").frames.length > 0)
      {
        let frame = this.assets.getAsset("deadspacechar1").frames[Math.floor(this.animations["deadspace"].getCurrentFrame(this.renderTick)/4)];
        this.layers["deadSpace"].ctx.drawImage(frame, 0, 0, frame.width, frame.height);
        this.ctx.drawImage(frame, this.squareWidthOffset+((game.currentMaze.width/2)*this.blockWidth)-((game.currentMaze.deadSize/2)*this.blockWidth),
        this.squareHeightOffset+((game.currentMaze.width/2)*this.blockHeight)-((game.currentMaze.deadSize/2)*this.blockHeight),
         (game.currentMaze.deadSize*this.blockWidth)/1, (game.currentMaze.deadSize*this.blockHeight)/1);
      }
    }

    displayCharacter(game)
    {
      //display trail

      game.player.playerTrail.displayTrail(this.layers["mazeParticles"]);

      //display character
      this.ctx.beginPath();
      this.layers["character"].ctx.clearRect(0, 0, this.blockWidth, this.blockHeight);
      let playerX = game.player.xPos;
      let playerY = game.player.yPos;

      if (game.player.moving)
      {
        playerX = ((game.player.xPos*Math.abs(game.player.moveSubstep-1))+(game.player.currentPath[0][0]*game.player.moveSubstep));
        playerY = ((game.player.yPos*Math.abs(game.player.moveSubstep-1))+(game.player.currentPath[0][1]*game.player.moveSubstep));
      }
      if (this.assets.loadingAssets.length === 0)
      {
        this.layers["character"].ctx.drawImage(
          this.assets.getAsset("charactersheet").frames[Math.floor(this.animations["character"].currentFrame/8)],
          0, 0, this.blockWidth, this.blockHeight);
        this.ctx.drawImage(this.layers["character"].canvas, (playerX*this.blockWidth)+this.squareWidthOffset, (playerY*this.blockHeight)+this.squareHeightOffset, this.blockWidth, this.blockHeight);
      }
      // this.ctx.rect((playerX*this.blockWidth+7)+this.squareWidthOffset, (playerY*this.blockHeight+7)+this.squareHeightOffset, this.blockWidth-14, this.blockHeight-14);
      //
      // this.ctx.fillStyle = "red";
      //
      // this.ctx.fill();
    }

    displayMaze(maze, game)
    {
      if (this.updateFrame && this.assets.loadingAssets.length === 0)
      {
        this.layers["maze"].clear();
        this.layers["mazeTexture"].clear();
        this.layers["mazeBackground"].clear();
        this.blockWidth = this.canvasSquareSize/maze.width;
        this.blockHeight = this.canvasSquareSize/maze.height;

      //  this.ctx.drawImage(this.assets.getAsset("background").image, this.squareWidthOffset, this.squareHeightOffset, this.canvasSquareSize, this.canvasSquareSize);

        for (let i = 0; i <= 3; i++)
        {
          let quadrantWidth = Math.floor((this.blockWidth*maze.width)/2);
          let quadrantHeight = Math.floor((this.blockHeight*maze.height)/2);

          let xOffset = QDX[i]*quadrantWidth;
          let yOffset = QDY[i]*quadrantHeight;

          let quadrantBackground = game.quadrants[i].backgroundImage;
          this.layers["mazeBackground"].ctx.drawImage(quadrantBackground, xOffset, yOffset, quadrantWidth, quadrantHeight);
        }

        this.ctx.drawImage(this.layers["mazeBackground"].canvas, this.squareWidthOffset, this.squareHeightOffset, this.canvasSquareSize, this.canvasSquareSize);

        for (let x = 0; x < maze.width; x++)
        {
          for (let y = 0; y < maze.height; y++)
          {
            this.displayBlockSolid(x, y, maze.grid[x][y]);
          }
        }

        for (let x = 0; x < maze.width; x++)
        {
          for (let y = 0; y < maze.height; y++)
          {
            if (!maze.grid[x][y].dead) {
              this.displayBlockWalls(x, y, maze.grid[x][y]);
            }
          }
        }


        this.layers["mazeTexture"].ctx.drawImage(this.layers["maze"].canvas, 0, 0, this.canvasSquareSize, this.canvasSquareSize);
        this.layers["mazeTexture"].ctx.globalCompositeOperation = "source-in";


        let gradient = this.layers["mazeTexture"].ctx.createLinearGradient(0, 0, this.canvasSquareSize, this.canvasSquareSize);
        gradient.addColorStop(0, "green");
        gradient.addColorStop(1, "blue");
        this.layers["mazeTexture"].ctx.fillStyle = gradient;
        this.layers["mazeTexture"].ctx.fillRect(0, 0, this.canvasSquareSize, this.canvasSquareSize);

        this.layers["mazeTexture"].ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(this.layers["mazeTexture"].canvas, this.squareWidthOffset, this.squareHeightOffset, this.canvasSquareSize, this.canvasSquareSize);
      }

    }

    displayBackground()
    {
      //this.backgroundTexture = document.getElementById("backgroundTex");
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawWall(x1, y1, x2, y2)
    {
      let wallThickness = 8;
      this.layers["maze"].ctx.strokeStyle = "#00000077";
      this.layers["maze"].ctx.lineWidth = 10;
      this.layers["maze"].ctx.beginPath();
      this.layers["maze"].ctx.moveTo(x1, y1);
      this.layers["maze"].ctx.lineTo(x2, y2);
      this.layers["maze"].ctx.stroke();
      this.layers["maze"].ctx.closePath();
    //   this.ctx.fillStyle = "black";
    //   this.ctx.drawImage(this.wallTexture, x1-(wallThickness/2), y1-(wallThickness/2), (x2-x1)+wallThickness, (y2-y1)+wallThickness);
    }

    displayNorthWall(xPos, yPos)
    {
      this.drawWall(xPos*this.blockWidth, yPos*this.blockHeight, (xPos*this.blockWidth)+this.blockWidth, yPos*this.blockHeight);
    }

    displayEastWall(xPos, yPos)
    {
      this.drawWall((xPos*this.blockWidth)+this.blockWidth, yPos*this.blockHeight, (xPos*this.blockWidth)+this.blockWidth, (yPos*this.blockHeight)+this.blockHeight);
    }

    displaySouthWall(xPos, yPos)
    {
      this.drawWall(xPos*this.blockWidth, (yPos*this.blockHeight)+this.blockHeight, (xPos*this.blockWidth)+this.blockWidth, (yPos*this.blockHeight)+this.blockHeight);
    }

    displayWestWall(xPos, yPos)
    {
      this.drawWall(xPos*this.blockWidth, yPos*this.blockHeight, (xPos*this.blockWidth), (yPos*this.blockHeight)+this.blockHeight);
    }

   displayBlockWalls(xPos, yPos, block)
    {


      // let wallString = "";
      // if (block.walls[0])
      // {
      //   wallString += "n";
      // }
      // if (block.walls[1])
      // {
      //     wallString += "e";
      // }
      // if (block.walls[2])
      // {
      //     wallString += "s";
      // }
      // if (block.walls[3])
      // {
      //     wallString += "w";
      // }
      // this.m_ctx.drawImage(this.loadedWallTiles.assets[`${wallString}-wall.png`], xPos*this.blockWidth, yPos*this.blockHeight, this.blockWidth, this.blockHeight);

      if (block.walls[0])
      {
        this.displayNorthWall(xPos, yPos);
      }
      if (block.walls[1])
      {
          this.displayEastWall(xPos, yPos);
      }
      if (block.walls[2])
      {
          this.displaySouthWall(xPos, yPos);
      }
      if (block.walls[3])
      {
          this.displayWestWall(xPos, yPos);
      }
    }

    displayBlockSolid(xPos, yPos, block)
    {
        this.ctx.beginPath();
    //  ctx.rect(xPos*this.blockWidth, yPos*this.blockHeight, this.blockWidth, this.blockHeight);
      if (block.visited)
      {
        this.ctx.fillStyle = "red";
      }
      else
      {
        this.ctx.fillStyle = "blue";
      }
        this.ctx.fill();
    }

}

//Generates the maze
class MazeGenerator
{
  constructor()
  {
    this.maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT);
    this.quadrants = [];
  }

  generateQuadrant(quadrant)
  {
    let quadrantWidth = Math.floor(MAZE_WIDTH/2);
    let quadrantHeight = Math.floor(MAZE_HEIGHT/2);
    let newQuadrant = new Maze(quadrantWidth, quadrantHeight, quadrant);
    this.carveFrom(newQuadrant, QDX[quadrant]*(quadrantWidth-1), QDY[quadrant]*(quadrantHeight-1));
    return newQuadrant
  }

  carveFrom(maze, x, y)
  {
    let directions = [0, 1, 2, 3];
    shuffle(directions);
    maze.grid[x][y].visited = true;
    for (let i = 0; i <= 3; i++)
    {
      let direction = directions[i];

      let nx = x+DX[direction];
      let ny = y+DY[direction];

      if (nx >= 0 && ny >= 0 && nx < maze.width && ny < maze.height)
      {
        if (!maze.grid[nx][ny].visited && !maze.grid[nx][ny].dead)
        {
          maze.grid[x][y].walls[direction] = false;
          maze.grid[nx][ny].walls[OPPOSITE[direction]] = false;
          this.carveFrom(maze, nx, ny);
        }
      }
    }
  }

  stitchQuadrants(quadrants)
  {
    let quadrantWidth = quadrants[0].width;
    let quadrantHeight = quadrants[0].height;

    //create base grid to be filled with quadrant info
    let newGrid = [];
    for (let x = 0; x < MAZE_WIDTH; x++)
    {
      newGrid.push([]);
      for (let y = 0; y < MAZE_HEIGHT; y++)
      {
        newGrid[x].push(null);
      }
    }

    //fill grid with quadrant info
    for (let i = 0; i <= 3; i++)
    {
      for (let x = 0; x < quadrantWidth; x++)
      {
        for (let y = 0; y < quadrantHeight; y++)
        {
            newGrid[x+(quadrantWidth*QDX[i])][y+(quadrantHeight*QDY[i])] = quadrants[i].grid[x][y];
        }
      }
    }

    //break down the walls between the quadrants
    for (let x = 0; x < MAZE_WIDTH; x++)
    {
      this.makeTunnel(newGrid, x, quadrantHeight-1, 2);
    }
    for (let y = 0; y < MAZE_HEIGHT; y++)
    {
      this.makeTunnel(newGrid, quadrantWidth-1, y, 1);
    }

    return newGrid;
  }

  makeTunnel(grid, xPos, yPos, direction)
  {
    grid[xPos][yPos].walls[direction] = false;
    grid[xPos+DX[direction]][yPos+DY[direction]].walls[OPPOSITE[direction]] = false;
  }

  generateMaze()
  {
    //this.carveFrom(this.maze, 0, 0);
    for (let i = 0; i <= 3; i++)
    {
      let newQuadrant = this.generateQuadrant(i);
      this.quadrants.push(newQuadrant);
    }
    this.maze.grid = this.stitchQuadrants(this.quadrants);
  }
}


//end class definitions

let globalMaze;

let game;

function setup()
{
  globalMaze = new Maze(MAZE_WIDTH, MAZE_HEIGHT);
  game = new Game();

  let generator = new MazeGenerator();
  game.generator = generator;
  generator.maze = globalMaze
  generator.generateMaze();
  game.currentMaze = globalMaze;

  //Display loop.
  window.requestAnimationFrame(function () { game.renderer.renderLoop(game); }.bind(game.renderer));

  //"keydown" event handler.
  document.addEventListener("keydown", function (e) { game.buttonPressed(e) });

  //"game loop" interval.
  setInterval(function() { game.gameLoop() }.bind(game), 50)
}

document.addEventListener("DOMContentLoaded", function () { setup(); });
