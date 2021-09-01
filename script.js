// Store our Pipes directions within an array
// NOTE: We need to look into extending this on a per row basis

let pipeDef = [];

// Set rows to have letter assigned
var rowAlpha = 'A'.charCodeAt(0);
var curRow = String.fromCharCode(rowAlpha++)

// Array of classes for our different types of pipe
var pipeType = ['empty', 'straight-end', 'straight', 'angle', 'junction', 'cross'];
var pipeTypeX = [['Up','Down'], ['Up','Right','Down','Left'], ['Right', 'Down'], ['Up', 'Right', 'Down'], ['None']]

var myPipes = [1,2,2,3,3,1,1,2,3,3,1,3,2,1,1,
1, 3, 2, 4, 2, 1, 1, 2, 4, 4, 3, 3, 1, 3, 2,
2, 1, 1, 4, 3, 4, 2, 3, 1, 2, 2, 1, 1, 4, 2,
3, 4, 1, 4, 2, 4, 1, 2, 4, 3, 4, 4, 1, 4, 3,
1, 4, 1, 1, 1, 4, 4, 4, 2, 1, 4, 4, 2, 4, 3,
3, 4, 1, 1, 4, 4, 1, 2, 3, 3, 3, 4, 4, 1, 1,
1, 2, 4, 1, 1, 1, 1, 4, 1, 4, 4, 1, 3, 4, 3,
3, 4, 4, 1, 3, 4, 2, 5, 4, 4, 4, 4, 3, 1, 2,
3, 2, 4, 4, 1, 4, 1, 3, 2, 3, 1, 1, 4, 1, 2,
1, 1, 1, 4, 1, 3, 3, 4, 4, 4, 3, 3, 4, 1, 1,
1, 2, 1, 4, 3, 2, 4, 3, 1, 4, 4, 2, 4, 2, 1,
4, 4, 4, 4, 4, 4, 1, 3, 1, 2, 4, 3, 4, 1, 1,
2, 1, 4, 1, 3, 4, 4, 3, 1, 1, 2, 2, 1, 1, 2,
4, 3, 4, 3, 4, 1, 1, 4, 3, 3, 3, 4, 4, 4, 4,
1, 1, 1, 1, 4, 2, 1, 1, 1, 3, 1, 3, 3, 1, 1
]

// Text for pipe current direction
var dirText = [ "Up", "Right", "Down", "Left"];

// Set initial line count & pipe count
var lineCount = 0; // current line
var pipeCount = 0; // current pipe number

// Set the initial number of total blocks and columns
var columns = 15; // Total of 4 coluns - 4 * 4 = 16 total blocks
var totalBlocks = 225;

$(document).ready(function() {
  
  // Add the first row with the start point
  //addStart();
  
  // Call our newPipe function for the total number of blocks
  for (var i = 0; i < totalBlocks; i++) {
    newPipe(myPipes[i]);
  }

  // Add the final end block to the screen
  //addEnd();
  
  // When a pipe is clicked on the left half, turn counter clockwise & save the direction
  $(document).on("click touchstart", ".left", function() {
    pipeID = $(this)
      .next()
      .next()
      .attr("id")
      .substring(5);
    pipeDef[pipeID].direction -= 90;
    $(this)
      .next()
      .next()
      .css("transform", "rotate(" + pipeDef[pipeID].direction + "deg)");
  });

  // When a pipe is clicked on the right half, turn clockwise & save the direction
  $(document).on("click touchstart", ".right", function() {
    pipeID = $(this)
      .next()
      .attr("id")
      .substring(5);
    pipeDef[pipeID].direction += 90;
    $(this)
      .next()
      .css("transform", "rotate(" + pipeDef[pipeID].direction + "deg)");
  });
});

// Function to add a new pipe to the screen
function newPipe(myPipe) {
    
  // When the current lineCount reaches the column maximum, force a clear to start a new line
  if (lineCount == columns) {
    $(".container").append($("<div>", { style: "clear: both" }));
    lineCount = 0;
    curRow = String.fromCharCode(rowAlpha++)
  }

  // Add our new 'box' div within the content div
  $(".container").append($("<div>", { class: "box" }));

  // Add the left overlaid div as a child of 'box'
  $(".box")
    .last()
    .append($("<div>", { class: "left" }));

  // Add the right overlaid div as a child of 'box'
  $(".box")
    .last()
    .append($("<div>", { class: "right" }));

  // Before any specific pipe code is spat out, call function which will return the details of the pipe as an object. Pass argument of "A1" etc.
  
  // curRow = A | lineCount = 0 + 1 (starts on line 0)
  var curPipe = valPipe(curRow + (lineCount+1), myPipe);
  
  // Increase the pipeDef array to have the same number of elements as there are pipes.
  if (pipeDef.length <= pipeCount) {
    pipeDef.push(curPipe);
  }
      
  //alert(pipeDef[pipeCount].direction);
  //alert(curPipe.id + " " + curPipe.direction + " " + curPipe.type);
   
  // Here we need to put our algorithm to make this work.
  // Also need random rotation for each pipe so that they don't always start in the same direction!
  
  // I need to calculate the route for a win from A1 to D4.
  // So, A1, A2, B2, B3, C3, D3, D4
  
  //     1  2  3  4
  // A [[X][X][ ][ ]]
  // B [[ ][X][X][ ]]
  // C [[ ][ ][X][ ]]
  // D [[ ][ ][X][X]]
  
  // A1 is Bend, Junction or cross
  // A2 is Bend, Junction or Cross
  // B2 is Bend, Junction or Cross
  // B3 is Bend, Junction or Cross
  // C3 is Straight, Junction or Cross
  // D3 is Bend, Junction or Cross
  // D4 is Straight, Junction or Cross
  
  // Then we need to work out orientation of pipes
  
  // If pipeType = 2 for first pipe, we need to make A2 have a pipe
  // if A2 = pipeType 2 then B2 must have pipe!
  // if B2 = pipeType 2 then B1 or B3 must have pipe!

  // add our actual pipe span (Random)
  $(".box")
    .last()
    .append(
      $("<span>", { class: "pipeblock pipe pipe-" +  pipeType[curPipe.type], id: "pipe-" + pipeCount, style: "transform: rotate(" + curPipe.direction + "deg);" })
    );

  // Increment the pipeCount & lineCount counters
  pipeCount += 1;
  lineCount += 1;

  // Output number of rows and columns to test area
  document.getElementById("rowCount").value = Math.ceil(pipeCount / columns); 
  document.getElementById("colCount").value = columns;

}

// Add a new "Start" block/label to the first line.
function addStart() {
  
  // Add our new 'box' div within the content div
  $(".container").append($("<div>", { class: "box fake"}));
  
  // Add the end pipe as a child of 'box'
  $(".box")
    .last()
    .append($("<span>", { class: "startPipe", text: "Start" }));
  
  for (var i = 0; i < (columns - 1); i++){
    $(".container").append($("<div>", { class: "box fake"})); 
  };

  $(".container").append($("<div>", { style: "clear: both" }));
  
}

// Add a new "End" block/label to the last pipe added.
function addEnd() {
  
  // Add our new 'box' div within the content div
  $(".container").append($("<div>", { class: "box", style: "width:25px; border: none; position: absolute;"}));
  
  // Add the end pipe as a child of 'box'
  $(".box")
    .last()
    .append($("<span>", { class: "endPipe", text: "End" }));
}

// Function to add a new pipe to the screen
function updatePipes() {
  clearAll();
  columns = document.getElementById("colCount").value;
  totalBlocks = document.getElementById("rowCount").value * columns;
  
  //alert("Columns: " + columns + " | Total Blocks: " + totalBlocks + " | Rows: " + (totalBlocks / columns));

  //addStart();
  for (var i = 0; i < totalBlocks; i++) newPipe();
  //addEnd();
}

function clearAll() {
  //$(".container").innerHTML = '';
  
  // Store our Pipes directions within an array
  pipeDef = [];

  // Set initial line count & pipe count
  lineCount = 0;
  pipeCount = 0;
  document.getElementById("container").innerHTML = "";
  
  // reset row letters
  rowAlpha = 'A'.charCodeAt(0);
  curRow = String.fromCharCode(rowAlpha++)
  
}

function valPipe(cell, myPipe) {
  
  var x
  
  var topLeft = (pipeCount - columns - 1 >= 0 && (pipeCount - columns - 1) % columns != (columns-1) ? pipeCount - columns - 1 : "None");
  var top = (pipeCount - columns >= 0 ? pipeCount - columns : "None");
  var topRight = (pipeCount - columns + 1 >= 0 && (pipeCount - columns + 1) % columns != 0 ? pipeCount - columns + 1 : "None");
  var left = (pipeCount - 1 >= 0 && (pipeCount - 1) % columns != (columns-1) ? pipeCount -1 : "None");
  
  // If A1 (So if Above = Empty and Left = Empty and lineCount not final pipe) then must contain pipe (not empty)
  // If Above = empty & left = straight then pick anything. 
  // If above = empty & left = bent then pick any other than empty
  
  // Set x to a random value between 0-4 (0-3 for first element and last element)
  // First element can be 0-3 but last needs to check various bits!
  if (cell == 'A1') {
    x = Math.floor(Math.random() * 4);
  } else {
    x = pipeCount == 0 ? Math.floor(Math.random() * 4) : pipeCount == (totalBlocks -1) ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 5);
  }
  
  //if (left != "None") {
  //  $('.bottomConsole').append(pipeTypeX[pipeDef[left].type].includes('Right'));
  //}
  
  // A1 - Still tempted to just check for cell == 'A1' here...
  if (left == "None" && top == "None") {
    
    // Setting direction to -90 as the images I'm using are not the same as the actual algorithm being used.
    var y = -90;
    var dirCount = 0;
    var dirCheck = "";
    var z = [];
    
    // This for loop swaps our directions to see which orientations are valid (Does the pipe connect?)
    for (var r = 0; r < 4; r++) {
      
      dirCheck = "Run " + (r+1) + ": ";
      
      for (var i = 0; i < pipeTypeX[x].length; i++) {
        dirCheck += (
          (
            ((dirText.indexOf(pipeTypeX[x][i])+r) > (dirText.length -1)) 
            ? ((dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length -1) > 0)
            ? dirText[(dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length - 1) - 1] 
            : dirText[(dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length - 1) + 2] 
            : dirText[(dirText.indexOf(pipeTypeX[x][i])+r)]
          )
          + "[" + 
          (
            ((dirText.indexOf(pipeTypeX[x][i])+r) > (dirText.length -1))
            ? ((dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length -1) > 0) // if out of bounds, this corrects index 
            ? (dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length -1) - 1
            : (dirText.indexOf(pipeTypeX[x][i])+r)%(dirText.length -1) + 2
            : (dirText.indexOf(pipeTypeX[x][i])+r) // if within bounds, this simply grabs new index
          )
          + "] "
        );
        
        // puts all current directions into string, if our count >= 2 then it's a valid pipe that
        // we can use to connect to others. If so, we +1 to our master check. At the end if our total > 0 
        // the pipe is valid? I need to save f though on a "good" pipe.
        
        //alert("Run " + (f+1) + ": " + dirText.indexOf(pipeTypeX[x][i]) + " - " + pipeTypeX[x][i] + " Becomes: " + (((dirText.indexOf(pipeTypeX[x][i])+f) > (dirText.length -1)) ? (dirText.indexOf(pipeTypeX[x][i])+f)%(dirText.length -1)-1 : (dirText.indexOf(pipeTypeX[x][i])+f)) + " - " + (((dirText.indexOf(pipeTypeX[x][i])+f) > (dirText.length -1)) ? dirText[(dirText.indexOf(pipeTypeX[x][i])+f)%(dirText.length -1)-1] : dirText[(dirText.indexOf(pipeTypeX[x][i])+f)]));
        
        //alert(dirText.indexOf(pipeTypeX[x][i])+f%(dirText.length -1) + " - " + (dirText.length -1));
        
      }
      
      // These need to be dynamic based upon what's around it.
      dirCount += (dirCheck.includes('Up')) ? 1 : -1;
      dirCount += (dirCheck.includes('Right')) ? 1 : 0;
      dirCount += (dirCheck.includes('Down')) ? 1 : 0;
      dirCount += (dirCheck.includes('Left')) ? 0 : 0;
      
      //bleh += (pipeTypeX[x].includes('Up')) ? 1 : -1;
      //bleh += (pipeTypeX[x].includes('Right')) ? 1 : 0;
      //bleh += (pipeTypeX[x].includes('Down')) ? 1 : 0;
      //bleh += (pipeTypeX[x].includes('Left')) ? -1 : 0;

      // Add successful direction to Connection State
      if (dirCount >= 2) {
        z.push(r);
      }
      
      dirCount = 0;

    }
          
  } else {
    // Direction of pipe (When finished will be based on surrounding)
    var y = 90 * Math.floor(Math.random() * 4);
    // Shoving directions in here for now. Changing to orientation (0-3) later - can have more than 1 value
    var z = pipeTypeX[x];
  }
 
  
  $('.bottomConsole').append('<hr />');
  
  console.log(x)
    
  return {
    id : cell, // A1 (A1-E5)
    type : myPipe, // 1 (Used in pipeType Array (0,1,2,3,4))
    direction : y, // 90 (Degrees (0,90,180,270))
    state: z // 1,2 (Orientations that are valid (0-3))
  };
}

function test() {
  $(".bottomConsole").empty();
  
  var dirNum;
  
  for (var i = 0; i < pipeDef.length; i++) {
    
    dirNum = pipeDef[i].direction / 360;
    dirNum = (dirNum - Math.floor(dirNum)) * 4;
      
    $(".bottomConsole").append("Pipe ID: pipe-" + i + " | Pipe Position: " + pipeDef[i].id + " | Pipe Direction: " + pipeDef[i].direction + " ( " + dirText[dirNum] + ") | Pipe Type: " + pipeType[pipeDef[i].type] + " | Connection State: " + pipeDef[i].state + "<br />");
    
  }
}

// NOTES:
// Make button with slider to select difficulty ?
// Easy - Normal - Hard - Extreme - Expert
// 2x2 - 3x3 - 4x4 - 5x5 - 6x6
// Multi dimensional  key-pair/array? each side has an index?
// create algorithm to generate correct "path" to win
// and based on difficulty, spit out "grid" in random
// order (avoiding solved path).
// top left & bottom right always ends. Direction is
// random based on possible solved path outcomes