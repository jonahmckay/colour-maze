"use strict";

// directions: [N, E, S, W]

let canvasWidth = 800;
let canvasHeight = 800;

let DX = [0, 1, 0, -1];
let DY = [-1, 0, 1, 0];

let OPPOSITE = [2, 3, 0, 1];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
    this.width = 20;
    this.height = 20;

    this.deadSize = 8;
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
}

class MazeRenderer
{
    constructor()
    {
      this.ctx = null;
      this.blockWidth = 30;
      this.blockHeight = 30;
    }

    displayMaze(maze)
    {
      this.ctx.clearRect(0, 0, 800, 800);
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


    }

     drawWall(x1, y1, x2, y2)
    {
      this.ctx.strokeStyle = "#000000";
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.closePath();
      this.ctx.stroke();
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
          //this.displaySouthWall(xPos, yPos);
      }
      if (block.walls[3])
      {
          //this.displayWestWall(xPos, yPos);
      }
    }

     displayBlockSolid(xPos, yPos, block)
    {
      ctx.beginPath();
      ctx.rect(xPos*this.blockWidth, yPos*this.blockHeight, this.blockWidth, this.blockHeight);
      if (block.visited)
      {
      ctx.fillStyle = "red";
      }
      else
      {
        ctx.fillStyle = "blue";
      }
      ctx.fill();
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
          renderer.displayMaze(this.maze);
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

let renderer = new MazeRenderer();

function setup()
{
  let canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');

  renderer.ctx = ctx;
//  renderer.displayMaze(generator.maze);

  let generator = new MazeGenerator();
  generator.generateMaze(renderer);


}

console.log("Hey");
document.addEventListener("DOMContentLoaded", function () { setup(); });

window.requestAnimationFrame(function () { renderer.displayMaze }.bind(renderer));
//setInterval(100, renderer.displayMaze);
