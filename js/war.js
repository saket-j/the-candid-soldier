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
    var blockx = gamec.width/5;
    var blocky = gamec.height/4;
    for (var i = 0; i < terrc; i++) {
        var x = Math.ceil(Math.random()*(blockx-40)) + i*blockx + 20;
        var y = Math.ceil(Math.random()*blocky) + 20;
        terr.push([x,y,Math.ceil(Math.random()*200)]);  // third value is current value of update count
    }

    bulletsc = 0;
    for (var i = 0; i < terrc; i++) {
        // cx cy in_speed speed_incr_time_elapsed 
        bullets.push([-1,-1,5,0]);
        bulletsc++;
    }
}

function main() {
    if (herodead || terrc==0) {
        //break the loop to finish
    }
    clearC();
    updateValues();
    renderElem();
}

function updateValues() {
    // if bullet hits an enemy
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
            var md = terr[i][0] - i*gamec.width/5 - 20;
            var ad = terr[i][0] - hero[0] - 25;
            terr[i][0] -= Math.min(md,Math.min(5,ad));
        }
        else {
            var md = (i+1)*gamec.width/5 -terr[i][0] - 20;
            var ad = -terr[i][0] + hero[0] + 25;
            terr[i][0] += Math.min(md,Math.min(5,ad));
        }
    }
    for (var i=0; i < bulletsc; i++) {
        if (bullets[i][0] != -1) {
            var incy = bullets[i][2];
            bullets[i][1] += Math.round(incy);
            bullets[i][3] += update_interval;
            if (bullets[i][1] > gamec.height) {
                bullets[i][0] = -1;
            }
        }
        else {
            if (bullets[i][3] > terr[i][2]) {
                bullets[i][3] = 0;
                bullets[i][2]++;
            }
            bullets[i][0] = terr[i][0];
            bullets[i][1] = terr[i][1];
        }
    }
}

function renderElem() {
    ctx.fillStyle = '#090';
    ctx.fillRect(hero[0],gamec.height-50,50,50);
    ctx.fillStyle = '#900';
    for (var i = 0; i < terrc; i++) {
        ctx.beginPath();
        ctx.arc(terr[i][0],terr[i][1],20,0,Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
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
