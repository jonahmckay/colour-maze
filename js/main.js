"use strict";

// directions: [N, E, S, W]

let DX = [0, 1, 0, -1];
let DY = [-1, 0, 1, 0];

let OPPOSITE = [2, 3, 0, 1];

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class Player
{
  constructor()
  {
    this.xPos = 0;
    this.yPos = 0;

    this.currentPath = [];
    this.moving = false;
    this.moveSubstep = 0;
    this.moveIncrement = 0.5;
  }

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

  updateMovement()
  {
    if (this.moving)
    {
      this.moveSubstep += this.moveIncrement;
      if (this.moveSubstep >= 0.98)
      {
        this.xPos = this.currentPath[0][0];
        this.yPos = this.currentPath[0][1];
        this.moveSubstep = this.moveSubstep-1;
        if (this.currentPath.length > 1)
        {
          this.currentPath.shift();
        }
        else
        {
          this.moving = false;
        }
      }
    }
  }

}

class MovementPath
{
  constructor()
  {
    this.path = [];
  }
}

class Game
{
  constructor()
  {
    this.player = new Player();
    this.currentMaze = new Maze();
    this.renderer = new GameRenderer();
  }

  gameLoop()
  {
    this.player.updateMovement();
  }

  buttonPressed(e)
  {
    this.renderer.updateFrame = true;

    // if (e.key === 's')
    // {
    //   this.player.yPos += 1;
    // }
    // else if (e.key === 'w')
    // {
    //   this.player.yPos += -1;
    // }
    // else if (e.key === 'a')
    // {
    //   this.player.xPos += -1;
    // }
    // else if (e.key === 'd')
    // {
    //   this.player.xPos += 1;
    // }
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
  }
}

class Block
{
  constructor()
  {
    this.walls = [true, true, true, true];
    this.visited = false;
    this.dead = false;
  }
}

class Maze
{
  constructor()
  {
    this.width = 17;
    this.height = 17;

    this.deadSize = 4;
    this.grid = [];
    this.initialize();
  }

  initialize()
  {
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
    console.log("maze initializsatipon done");
  }

  getPositionQuadrant(x, y)
  {
    //Quadrants clockwise from a 0 top-left
    let top = null;
    let left = null;

    if (x < Math.floor(this.width/2))
    {
      top = true;
    }
    else
    {
      top = false;
    }

    if (y < Math.floor(this.height/2))
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

class AssetLibrary
{
  constructor()
  {
    this.assets = {};
    this.loadingAssets = [];
  }

  addAsset(name, url)
  {
    let asset = new Image();
    asset.onload = function() { this.assetLoaded(name) }.bind(this);
    asset.src = url;
    this.assets[name] = asset;
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
class GameRenderer
{
    constructor()
    {
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

      this.blockWidth = 30;
      this.blockHeight = 30;

      this.wallTexture = document.getElementById("wallTex");
      this.updateFrame = true;
      this.loadedWallTiles = new AssetLibrary();
      this.assetsLoaded = false;

      // this.canvasWidth = window.innerWidth;
      // this.canvasHeight = window.innerHeight;

      this.marginMinimum = 150;

      this.squareWidthOffset = Math.floor(Math.abs(Math.min(this.marginMinimum, this.canvasWidth-this.canvasHeight))/2);
      this.squareHeightOffset = Math.floor(Math.abs(Math.min(this.marginMinimum, this.canvasHeight-this.canvasWidth))/2);
      this.canvasSquareSize = Math.min(this.canvasWidth, this.canvasHeight)-(this.marginMinimum*2);

      this.mazeCanvas = document.createElement("canvas");
      this.mazeCanvas.width = this.canvasSquareSize;
      this.mazeCanvas.height = this.canvasSquareSize;
      this.m_ctx = this.mazeCanvas.getContext("2d");

      this.mazeTextureCanvas = document.createElement("canvas");
      this.mazeTextureCanvas.width = this.canvasSquareSize;
      this.mazeTextureCanvas.height = this.canvasSquareSize;
      this.t_ctx = this.mazeTextureCanvas.getContext("2d");

      for (let i = 0; i < WALL_TILES.length; i++)
      {
        let tileName = WALL_TILES[i];
        let tileSrc = `imgs/tiles/${tileName}`;
        this.loadedWallTiles.addAsset(tileName, tileSrc);
      }

      this.scaleCanvases();
    }

    scaleCanvases()
    {
      if (this.canvasWidth !== window.innerWidth || this.canvasHeight !== window.innerHeight)
      {
        console.log(`${this.canvasSquareSize}, ${this.canvasWidth}, ${this.squareWidthOffset}`)
        console.log(`${this.squareWidthOffset}, ${this.squareHeightOffset}`);
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;

        this.squareWidthOffset = Math.floor((Math.max(0, this.canvasWidth-this.canvasHeight)+this.marginMinimum)/2);
        this.squareHeightOffset = Math.floor((Math.max(0, this.canvasHeight-this.canvasWidth)+this.marginMinimum)/2);
        this.canvasSquareSize = Math.min(this.canvasWidth, this.canvasHeight)-(this.marginMinimum);

        this.ctx.canvas.width  = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        this.m_ctx.canvas.width  = this.canvasSquareSize;
        this.m_ctx.canvas.height = this.canvasSquareSize;

        this.t_ctx.canvas.width  = this.canvasSquareSize;
        this.t_ctx.canvas.height = this.canvasSquareSize;
      }
    }

    renderLoop(game)
    {
      if (this.updateFrame && this.loadedWallTiles.loadingAssets.length === 0)
      {
        this.scaleCanvases();

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.m_ctx.clearRect(0, 0, this.canvasSquareSize, this.canvasSquareSize);
        this.t_ctx.clearRect(0, 0, this.canvasSquareSize, this.canvasSquareSize);

        this.displayBackground();
        this.displayMaze(game.currentMaze);
        this.displayCharacter(game);
      }
      window.requestAnimationFrame(function () { this.renderLoop(game); }.bind(this));
    }

    displayCharacter(game)
    {
      this.ctx.beginPath();

      let playerX = game.player.xPos;
      let playerY = game.player.yPos;

      if (game.player.moving)
      {
        playerX = ((game.player.xPos*Math.abs(game.player.moveSubstep-1))+(game.player.currentPath[0][0]*game.player.moveSubstep));
        playerY = ((game.player.yPos*Math.abs(game.player.moveSubstep-1))+(game.player.currentPath[0][1]*game.player.moveSubstep));
      }
      this.ctx.rect((playerX*this.blockWidth+7)+this.squareWidthOffset, (playerY*this.blockHeight+7)+this.squareHeightOffset, this.blockWidth-14, this.blockHeight-14);

      this.ctx.fillStyle = "red";

      this.ctx.fill();
    }

    displayMaze(maze)
    {
      if (this.updateFrame && this.loadedWallTiles.loadingAssets.length === 0)
      {

        this.blockWidth = this.canvasSquareSize/maze.width;
        this.blockHeight = this.canvasSquareSize/maze.height;
        this.wallTexture = document.getElementById("wallTex");


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


        this.t_ctx.drawImage(this.mazeCanvas, 0, 0, this.canvasSquareSize, this.canvasSquareSize);
        this.t_ctx.globalCompositeOperation = "source-in";


        let gradient = this.t_ctx.createLinearGradient(0, 0, this.canvasSquareSize, this.canvasSquareSize);
        gradient.addColorStop(0, "green");
        gradient.addColorStop(1, "blue");
        this.t_ctx.fillStyle = gradient;
        this.t_ctx.fillRect(0, 0, this.canvasSquareSize, this.canvasSquareSize);

        this.t_ctx.globalCompositeOperation = "source-over";
        this.ctx.drawImage(this.mazeTextureCanvas, this.squareWidthOffset, this.squareHeightOffset, this.canvasSquareSize, this.canvasSquareSize);
        //this.updateFrame = false;

      }

    }

    displayBackground()
    {
      //this.backgroundTexture = document.getElementById("backgroundTex");
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawWall(x1, y1, x2, y2)
    {
      let wallThickness = 8;
      this.m_ctx.strokeStyle = "#000000";
      this.m_ctx.lineWidth = 10;
      this.m_ctx.beginPath();
      this.m_ctx.moveTo(x1, y1);
      this.m_ctx.lineTo(x2, y2);
      this.m_ctx.stroke();
      this.m_ctx.closePath();
    //   this.ctx.fillStyle = "black";
    // //  console.log(`${x1-wallThickness}, ${y1-wallThickness}, ${(x2-x1)+wallThickness}, ${(y2-y1)+wallThickness}`);
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

class MazeGenerator
{
  constructor()
  {
    this.maze = new Maze();
  }

  carveFrom(x, y, renderer)
  {
    let directions = [0, 1, 2, 3];
    shuffle(directions);
    //let directions = Math.floor(Math.random()*4);

    this.maze.grid[x][y].visited = true;
    for (let i = 0; i <= 3; i++)
    {
      let direction = directions[i];

      let nx = x+DX[direction];
      let ny = y+DY[direction];

      if (nx >= 0 && ny >= 0 && nx < this.maze.width && ny < this.maze.height)
      {
        if (!this.maze.grid[nx][ny].visited && !this.maze.grid[nx][ny].dead)
        {
          this.maze.grid[x][y].walls[direction] = false;
          this.maze.grid[nx][ny].walls[OPPOSITE[direction]] = false;
          this.carveFrom(nx, ny, renderer);
          //renderer.displayMaze(this.maze);
        //  alert("step");
        }
      }
    }
  }

  generateMaze(renderer)
  {
    this.carveFrom(0, 0, renderer);
  }
}


//end class definitions

let ctx;

//let renderer;
let globalMaze;

let game;

function setup()
{
//  renderer = new GameRenderer();
  globalMaze = new Maze();
  game = new Game();
  //let canvas = document.getElementById("canvas");
  //ctx = canvas.getContext('2d');

  //renderer.ctx = ctx;
  //game.renderer.ctx = ctx;
//  renderer.displayMaze(generator.maze);

  let generator = new MazeGenerator();
  generator.maze = globalMaze
  generator.generateMaze(game.renderer);
  game.currentMaze = globalMaze;
  window.requestAnimationFrame(function () { game.renderer.renderLoop(game); }.bind(game.renderer));
  document.addEventListener("keydown", function (e) { game.buttonPressed(e) });

  setInterval(function() { game.gameLoop() }.bind(game), 50)
}

console.log("Hey");
document.addEventListener("DOMContentLoaded", function () { setup(); });
