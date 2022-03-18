const files = [];

function setup() {
    let params = (new URL(document.location)).searchParams;
    let name = params.get("emojis");
    console.log(name);
    if (name != null && name != undefined) {
        addBackToSelectionButton();
        runWheel();
    } else {
        setupEmojisSelector();
    }
}

function addBackToSelectionButton() {
    let button = document.createElement("button");
    button.innerText = "Edition des entrées"
    button.addEventListener("click", removeSelectedEmojis);
    let emojisSelector = document.getElementById("emojiSelector");
    emojisSelector.appendChild(button);
}

function removeSelectedEmojis() {
    let params = (new URL(document.location)).searchParams;
    let name = params.get("emojis");
    var newUrl = window.location.href.replace(window.location.search,'');
    window.location.href = newUrl + `?preemojis=${name}`;
}

function setupEmojisSelector() {
    let params = (new URL(document.location)).searchParams;
    let name = params.get("preemojis");
    let input = document.createElement("input");
    input.type = "text";
    input.id = "emojis";
    input.value = name;
    let button = document.createElement("button");
    button.innerText = "Lancer la roue";
    button.addEventListener("click", selectEmojis);
    let emojisSelector = document.getElementById("emojiSelector");
    emojisSelector.appendChild(input);
    emojisSelector.appendChild(button);
    // <input type="text" id="emojis" name="text"><br><br>
    // <button onclick="selectEmojis()">TEST</button>
}

function selectEmojis() {
    let currentEmojiString = document.getElementById("emojis").value;

    // splitEmojis(currentEmojiString).forEach(x => emojis.push(x));

    window.location.href = window.location.href + `?emojis=${currentEmojiString}`;

    var newUrl = window.location.href.replace(window.location.search,'');
    window.location.href = newUrl + `?emojis=${currentEmojiString}`;
    // console.log("running");
    // let imagesInput = document.getElementById("files");
    // console.log(imagesInput.files);
    // const currentFiles = Array.from(imagesInput.files)

    // currentFiles.forEach(element => {
    //     files.push({file: element, url: URL.createObjectURL(element)})
    //     const img = document.createElement("img");
    //     img.src = URL.createObjectURL(element);
    //     img.height = 60;
    //     document.getElementById("test").appendChild(img);
    // });
}

function splitEmojis(emojiString) {
    return emojiString.split(",");
}

const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  };
  

function runWheel() {
    let params = (new URL(document.location)).searchParams;
    let name = params.get("emojis");
    console.log(name)
    let emojis = splitEmojis(name);

    console.log(emojis.length);
    console.log(createjs)
    var stage = new createjs.Stage("canvas");
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);
    
    var c = new createjs.Container(),
            s = new createjs.Shape();
        
    var segments = emojis.length,
        size = 250,
        angle = Math.PI*2/segments;
      
    // Draw a wheel  
    for (var i=0, l=segments; i<l; i++) {
        s.graphics.f(random_hex_color_code())//(i%2==0)?"#bbb":"#ddd")
          .mt(0,0)
          .lt(Math.cos(angle*i)*size, Math.sin(angle*i)*size)
            .arc(0,0,size, i*angle, i*angle+angle)
        .lt(0,0);
        
      // Add text child
        // var image = new createjs.Bitmap(files[i].url);
        // image.set({textAlign:"center", regY:size-5, rotation:angle*180/Math.PI * (i+0.5)});
        var num = new createjs.Text(emojis[i],(size/8)+"px Arial Black", "#888")
            .set({textAlign:"center", regY:size-5, rotation:angle*180/Math.PI * (i+0.5)});
        c.addChild(num);
    }   
    
    c.addChildAt(s, 0);
    c.x = c.y = size + 20; 
    c.cache(-size,-size,size*2,size*2);
    
    
    c.rotation = -360/segments/2; // Rotate by 1/2 segment to align at 0
    
    // Red Notch
    var notch = new createjs.Shape();
    notch.x = c.x;
    notch.y = c.y-size;
    notch.graphics.f("red").drawPolyStar(0,0,12,3,2,90);
    
    // Where the wheel should land
    // var newNum = new createjs.Text("0", "50px Arial", "#000")
    //     .set({x:c.x, y: c.y+size+10, textAlign:"center"});
    
    
    stage.addChild(c,notch);
    
    // Mode. 0=stopped, 1=moving, 2=stopping
    c.mode = 0;
    
    // When clicked, cycle mode.
    c.on("click", function(e) {
        if (c.mode == 0) {
          c.mode = 1;
      } else if (c.mode == 1) {
          c.mode = 2;
        
        // Slow down. Find the end angle, and tween to it
        var num = Math.random() * segments | 0, // Choose a number,
            angleR = angle * 180/Math.PI, // Angle in degrees
             adjusted = (c.rotation - 360),	// Add to the current rotation
          numRotations = Math.ceil(adjusted/360)*360 - num*angleR - angleR/2; // Find the final number.
        
        // newNum.text = num; // Show the end number
        
        createjs.Tween.get(c)
            .to({rotation:numRotations}, 3000, createjs.Ease.cubicOut)
          .call(function() { c.mode = 0; });
      }
    });
    
    
    function tick(event) {
        if (c.mode == 1) {
          c.rotation -= 10; // Rotate if mode 1
      }
        stage.update(event);
    }
}