var gameDiv = document.getElementById('gameDiv');
var keyDiv = document.getElementById('keyDiv');
var msgDiv = document.getElementById('msgDiv');
var
    W_KEY = 119,
    A_KEY = 97,
    S_KEY = 115,
    D_KEY = 100;

var
    WALL = "X",
    HEALTH = "+",
    EMPTY = " ",
    CACTUS = "#",
    BACON = "~",
    PLAYER = "o",
    GRAVE = "t";

var player, level;
var myLevel = [
        "XXXXXXXXXXXXXXXXXXXX",
        "X        X~     ~  X",
        "X  XXX  ~X   ###   X",
        "X   ~X   X+  ###   X",
        "X  XXX   X   ###   X",
        "X             ~    X",
        "X        XXXX      X",
        "X  #XXXXXX ~#      X",
        "X     ~ +X       ~ X",
        "XXXXXXXXXXXXXXXXXXXX"
    ];

// Player class
var Player = (function() {
    function Player(){
        this.x = 1;
        this.y = 1;
        this.score = 0;
        this.maxScore = 0;
        this.maxLife = 10;
        this.life = this.maxLife;
    };
    
    return Player;
})();

function handleKey(key)
{
    if(player.life == 0)
        return;
    
    var newX = player.x;
    var newY = player.y;
    
    if(key == W_KEY)
        newY--;
    else if(key == A_KEY)
        newX--;
    else if(key == S_KEY)
        newY++;
    else if(key == D_KEY)
        newX++;

    if(level[newY][newX] == EMPTY || level[newY][newX] == BACON || level[newY][newX] == HEALTH)
    {
        player.x = newX;
        player.y = newY;
        
        if(level[newY][newX] == BACON)
        {
            level[newY][newX] = EMPTY;
            player.score++;
        }
        else if(level[newY][newX] == HEALTH)
        {
            level[newY][newX] = EMPTY;
            if(player.life < player.maxLife)
                player.life++;
        }
        
        if(
            level[newY + 1][newX] == CACTUS
            || level[newY - 1][newX] == CACTUS
            || level[newY][newX + 1] == CACTUS
            || level[newY][newX - 1] == CACTUS
        )
        {
            player.life--;
        }

        drawLevel();
    }
}

function tile(type, i, j)
{
    var tileString = "<div class='tile "+typeString(type)+" "+getLight(i,j)+"'>" + type + "</div>";
    return tileString;
}

function typeString(type)
{
    var typeString = "";
    if(type == WALL){ typeString = "wall"; }
    if(type == HEALTH){ typeString = "health"; }
    if(type == EMPTY){ typeString = "empty"; }
    if(type == CACTUS){ typeString = "cactus"; }
    if(type == BACON){ typeString = "bacon"; }
    if(type == PLAYER){ typeString = "player"; }
    if(type == GRAVE){ typeString = "grave"; }
    return typeString;
}

function drawLevel()
{
    newInnerHTML = "";
    for(var i=0; i<level.length; i++)
    {
        for(var j=0; j<level[i].length; j++)
        {
            if(player.x == j && player.y == i)
            {
                if(player.life > 0)
                    newInnerHTML += tile(PLAYER, i, j);
                else
                    newInnerHTML += tile(GRAVE, i, j);
            }
            else
                newInnerHTML += tile(level[i][j], i, j);
        }
        newInnerHTML += "<br />";
    }
    newInnerHTML += "<br />Bacon: " + player.score + " / " + player.maxScore;
    newInnerHTML += "<br /><br />Life: ";
    for(var i=0; i<player.maxLife; i++)
    {
        if(i < player.life)
            newInnerHTML += HEALTH;
        else
            newInnerHTML += "-";
    }
    
    if(player.score == player.maxScore)
        msgDiv.innerHTML = "You found all the bacon! Click the start button to play again!";
    else if(player.life == 0)
        msgDiv.innerHTML = "You have died. Click the start button to play again!";
    
    gameDiv.innerHTML = newInnerHTML;
}

function getLight(i, j)
{
    var distance = Math.abs(player.x - j) + Math.abs(player.y - i);
    switch(distance) {
        case 0:
        case 1:
            return "light_F";
        case 2:
            return "light_C";
        case 3:
            return "light_9";
        case 4:
            return "light_6";
        case 5:
            return "light_3";
        default:
            return "light_0";
    }
}

function buildLevel()
{
    level = [];
    var row = [];
    var firstEmpty = true;

    if(window.location.href.split("?")[1] != null && window.location.href.split("?")[1].split("&")[0].split("=")[0] == "level")
    {
        myLevel = [];
        var levelRows = decodeURIComponent(window.location.href.split("?")[1].split("&")[0].split("=")[1]).split(";");
        for(var i=0; i<levelRows.length; i++)
        {
            myLevel.push(levelRows[i]);
        }
    }

    for(var i=0; i<myLevel.length; i++)
    {
        for(var j=0; j<myLevel[i].length; j++)
        {
            if(myLevel[i].substring(j, j+1) == PLAYER || (myLevel[i].substring(j, j+1) == EMPTY && firstEmpty && player != null))
            {
                player.x = j;
                player.y = i;
                row.push(EMPTY);
                firstEmpty = false;
            }
            else
                row.push(myLevel[i].substring(j, j+1));
            
            if(myLevel[i].substring(j, j+1) == BACON && player != undefined)
                player.maxScore++;
        }
        level.push(row);
        row = [];
    }
}

function resetKeyMsg()
{
    var key = "<u>KEY</u><br />";
    key += PLAYER + " "+typeString(PLAYER)+"<br />";
    key += WALL + " "+typeString(WALL)+"<br />";
    key += HEALTH + " "+typeString(HEALTH)+"<br />";
    key += CACTUS + " "+typeString(CACTUS)+"<br />";
    key += BACON + " "+typeString(BACON)+"<br />";
    key += GRAVE + " "+typeString(GRAVE)+"<br />";
    keyDiv.innerHTML = key;
    
    msgDiv.innerHTML = "";
}

function startGame()
{
    gameDiv.innerHTML = "Loading...";
    player = new Player();
    buildLevel();
    resetKeyMsg();
    drawLevel();
    document.onkeypress = function(event){
	    if(event.which)
            handleKey(event.which);
	    else
		    handleKey(event.keyCode);
	};
}