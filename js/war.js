var gamec;
var ctx;
var hero = [];
var terr = [];
var bullets = [];
var bulletsc = 0;
var terrc = 0;
var leftk = false;
var rightk = false;
var spacek = false;
var update_interval = 20;
var herodead = false;

var terr_ready = [false,false,false,false,false];

var terr2image = new Image();
terr2image.onload = function() {  
    terr_ready[1] = true;
};
terr2image.src = 'icons/t2.png';

var terr3image = new Image();
terr3image.onload = function() {  
    terr_ready[2] = true;
};
terr3image.src = 'icons/t3.png';

var terr4image = new Image();
terr4image.onload = function() {  
    terr_ready[3] = true;
};
terr4image.src = 'icons/t4.png';

var terr5image = new Image();
terr5image.onload = function() {  
    terr_ready[4] = true;
};
terr5image.src = 'icons/t5.png';

var terr1image = new Image();
terr1image.onload = function() {  
    terr_ready[0] = true;
};
terr1image.src = 'icons/t1.png';

terrim = [terr1image,terr2image,terr3image,terr4image,terr5image];

var heroi = false;
var heroimage = new Image();
heroimage.onload = function() {  
    heroi = true;
};
heroimage.src = 'icons/hero.png';


function init() {
    gamec = document.getElementById('game');
    ctx = gamec.getContext('2d');
    CreateElements();
    setInterval(main,update_interval);
    document.addEventListener('keydown',handlekeyDown,false);
    document.addEventListener('keyup',handlekeyUp,false);
}

function handlekeyUp(e) {
    if (e.keyCode == 39)
        rightk = false;
    else if (e.keyCode == 37)
        leftk = false;
    else if (e.keyCode == 32)
        spacek = false;
}

function handlekeyDown(e) {
    if (e.keyCode == 39)
        rightk = true;
    else if (e.keyCode == 37)
        leftk = true;
    else if (e.keyCode == 32)
        spacek = true;
}

function CreateElements() {
    hero.push(Math.ceil(Math.random()*(gamec.width-50)));
    hero.push(-1);  //bulletx
    hero.push(-1);  //bullety

    terrc = 5;
    var blockx = gamec.width/terrc;
    var blocky = gamec.height/4;
    for (var i = 0; i < terrc; i++) {
        var x = Math.ceil(Math.random()*(blockx-40)) + i*blockx + 20;
        var y = Math.ceil(Math.random()*blocky) + 20;
        terr.push([x,y]);
    }

    bulletsc = 0;
    for (var i = 0; i < terrc; i++) {
        // cx cy in_speed
        bullets.push([-1,-1,3+Math.ceil(Math.random()*7)]);
        bulletsc++;
    }
}

function main() {
    clearC();
    updateValues();
    renderElem();
}

function updateValues() {
    if (herodead || terrc==0)
        return;
    if (hero[1] != -1) {
        hero[2] = hero[2]-20;
        if (hero[2] < 0) {
            hero[1] = -1;
            hero[2] = -1;
        }
    }
    if (leftk==true) {
        hero[0] = Math.max(0,hero[0]-5);
    }
    if (rightk == true) {
        hero[0] = Math.min(gamec.width-50,hero[0]+5);
    }
    if (hero[1]==-1 && spacek==true) {
        hero[1] = hero[0]+25;
        hero[2] = gamec.height-50;
    }
    for (var i=0; i < terrc; i++) {
        if(hero[0]+25 < terr[i][0]) {
            var md = terr[i][0] - i*gamec.width/terrc - 20;
            var ad = terr[i][0] - hero[0] - 25;
            terr[i][0] -= Math.min(md,Math.min(5,ad));
        }
        else {
            var md = (i+1)*gamec.width/terrc -terr[i][0] - 20;
            var ad = -terr[i][0] + hero[0] + 25;
            terr[i][0] += Math.min(md,Math.min(5,ad));
        }
    }
    for (var i=0; i < bulletsc; i++) {
        if (bullets[i][0] != -1) {
            bullets[i][1] += bullets[i][2];
            if (bullets[i][1] > gamec.height) {
                bullets[i][0] = -1;
            }
        }
        else {
            bullets[i][0] = terr[i][0];
            bullets[i][1] = terr[i][1];
        }
    }
}

function renderElem() {
    if (herodead || terrc==0) {
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        if (herodead)
            ctx.fillText("You Lose!",10,10);
        else
            ctx.fillText("You Won!",10,10);
    }
    
    if (heroi && herodead==false) {
        ctx.drawImage(heroimage, hero[0], gamec.height-50);
    }
    
    for (var i = 0; i < terrc; i++) {
        if (terr_ready[i])
            ctx.drawImage(terrim[i], terr[i][0]-20, terr[i][1]-20);
    }
    
    ctx.fillStyle = '#eee';
    for (var i = 0; i < bulletsc; i++) {
        if (bullets[i][0] == -1)
            continue;
        ctx.beginPath();
        ctx.arc(bullets[i][0],bullets[i][1],2,0,Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    if (hero[1] != -1) {
        ctx.beginPath();
        ctx.arc(hero[1],hero[2],2,0,Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

    }
}

function clearC() {
    ctx.clearRect(0,0,gamec.width,gamec.height);
}
