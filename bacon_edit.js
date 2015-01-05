var editorDiv = document.getElementById('editorDiv');
var editorKeyDiv = document.getElementById('editorKeyDiv');
var linkDiv = document.getElementById('linkDiv');

var editorLevel;
var selectedType = WALL;

function startEditor()
{
    editorDiv.innerHTML = "Loading...";
    buildLevel(); // populate the level object in bacon.js
    editorLevel = level;
    buildEditor(); // place the tiles for editing
    drawEditorKey(selectedType); // render the key (selector)
}

function buildEditor()
{
    editorString = "";
    for(var i=0; i<editorLevel.length; i++)
    {
        for(var j=0; j<editorLevel[i].length; j++)
        {
            editorString += editorTile(editorLevel[i][j], i, j);
        }
        editorString += "<br style='clear:both;' />";
    }
    
    editorDiv.innerHTML = editorString;
}

function editorTile(type, i, j)
{
    var tileString = "<div class='tile editTile ";
    if(type == WALL){ tileString += "wall"; }
    if(type == HEALTH){ tileString += "health"; }
    if(type == EMPTY){ tileString += "empty"; }
    if(type == CACTUS){ tileString += "cactus"; }
    if(type == BACON){ tileString += "bacon"; }
    if(type == PLAYER){ tileString += "player"; }
    if(type == GRAVE){ tileString += "grave"; }
    tileString += "' onClick='changeTile("+i+", "+j+")'>"+type+"</div>";
    return tileString;
}

function drawEditorKey(selectType)
{
    keyString = "";
    keyString += keyTile(WALL, selectType == WALL);
    keyString += keyTile(HEALTH, selectType == HEALTH);
    keyString += keyTile(EMPTY, selectType == EMPTY);
    keyString += keyTile(CACTUS, selectType == CACTUS);
    keyString += keyTile(BACON, selectType == BACON);
    keyString += keyTile(PLAYER, selectType == PLAYER);

    keyString += "<br style='clear:both;' />";
    keyString += "Level size: ";
    keyString += "<input id='levelWidthInput' type='text' style='width:20px;' maxlength=2 />";
    keyString += "x";
    keyString += "<input id='levelHeightInput' type='text' style='width:20px;' maxlength=2 />";
    keyString += "<input type='button' value='Update' onClick='resizeLevel()' />";

    keyString += "<br style='clear:both;' /><input type='button' value='Create Level' onClick='createLink()' />"
    editorKeyDiv.innerHTML = keyString;
    selectedType = selectType;
}

function resizeLevel()
{
    var width = document.getElementById('levelWidthInput').value;
    var height = document.getElementById('levelHeightInput').value;
    var tempLevel = [];
    if(
        width != null && width > 1 && width < 100
        && height != null && height > 1 && height < 100
    )
    {
        for(var i=0; i<height; i++)
        {
            var tempRow = [];
            for(var j=0; j<width; j++)
            {
                if(editorLevel.length > i && editorLevel[i].length > j)
                    tempRow.push(editorLevel[i][j]);
                else
                    tempRow.push(EMPTY);
            }
            tempLevel.push(tempRow);
        }
        editorLevel = tempLevel;
        buildEditor();
    }
}

function keyTile(type, selected)
{
    var tileString = "<div class='tile editTile ";
    if(selected == 1)
        tileString += "selected ";
    tileString += " "+typeString(type)+"' onClick='drawEditorKey(\""+type+"\")'>"+type+"</div>&nbsp;"+typeString(type)+"<br />";
    return tileString;
}

function changeTile(i, j)
{
    if(selectedType == PLAYER)
    {
        var done = false;
        for(var a=0; a<editorLevel.length; a++)
        {
            if(done)
                break;
            
            for(var b=0; b<editorLevel[a].length; b++)
            {
                if(editorLevel[a][b] == PLAYER)
                {
                    editorLevel[a][b] = EMPTY;
                    done = true;
                    break;
                }
            }
        }
    }
    
    editorLevel[i][j] = selectedType;
    buildEditor();
}

function createLink()
{
    var levelLink = "bacon.html?level=";
    for(var i=0; i<editorLevel.length; i++)
    {
        for(var j=0; j<editorLevel[i].length; j++)
        {
            levelLink += encodeURIComponent(editorLevel[i][j]);
        }
        levelLink += encodeURIComponent(";");
    }
    linkDiv.innerHTML = "Link to your level:<br /><input type='text' style='width: 200px;' value='"+levelLink+"' /> <a href='"+levelLink+"'>Play it now!</a>";
}
