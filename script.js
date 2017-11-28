/* sets the char size */
Char_Size = 16
/* create local width and height values */
var w = window.innerWidth
var h = window.innerHeight

addEventListener('load', function (e) {
    /* creates all of the streams */
    for (var i = 0; i < Math.floor(window.innerWidth / Char_Size); i++) {
        /* Make new string */
        s = new Stream()
        /* Move the new strings x */
        s.x = Char_Size * i
        /* console log the stream */
        console.log("stream", s, i)
        /* add to 'array' (list) of streams */
        streams.push(s)
    }

    canvas = document.getElementById("MyCanvas");
    /* update local with and height values */
    w = window.innerWidth
    h = window.innerHeight
    /* change canvas size */
    document.getElementById("MyCanvas").width = w
    document.getElementById("MyCanvas").height = h

    /* Makes the animation start right away */
    /* Keep track if the code started the animation yet */
    var started = false
    /* While animation is not started */
    while (!started) {
        /* update all the char's 1/60th */
        streams.forEach(s => {
            s.update(1 / 60)
            /* if on the screen */
            if (s.y >= 0)
                /* let the loop know we are done */
                started = true
        })
    }
    /* starts frame updater */
    window.requestAnimationFrame(step);
});
streams = []
var last = 0;
class Stream {
    constructor() {
        /* determine how long the stream is going to be */
        this.size = Math.floor(Math.random() * 20) + 5
        /* make an empty array for char's to go */
        this.Chars = []
        this.x = 0
        this.y = -600
        /* decide how fast or slow the stream will be going */
        this.speed = Math.floor(Math.random() * 100) + 10
        /* decide if the first char will glow or not are the first or not */
        var first = Math.floor(Math.random() * 5) == 0
        for (var i = 0; i < this.size; i++) {
            /* makes a new char */
            var c = new Char(first)
            /* add it ti the array */
            this.Chars.push(c)
            /* make the rest of the chars be normal */
            first = false
        }
    }
    update(now) {
        /* moves the stream down the screen */
        this.y += this.speed * now
        /* move to the top of the screen if off the screen */
        this.y %= h + (this.size * Char_Size)

        /* tell all of the char's to update */
        this.Chars.forEach(c => {
            c.update(now)
        })
    }
    /* displays the stream with the canvas */
    display(ctx) {
        /* change font */
        ctx.font = Char_Size + "px Arial";
        for (var i = 0; i < this.size; i++) {
            /* if first char */
            if (this.Chars[i].First)
                /* change the color to light green */
                ctx.fillStyle = "#3f3";
            /* otherwise */
            else
                /* change the color to light green */
                ctx.fillStyle = "#080";
            /* Keep the x the same */
            var x = this.x
            /* Find the y value */
            var y = this.y - Char_Size * i
            /* put the char on the canvas */
            ctx.fillText(this.Chars[i].str, x, y);
        }
    }
}
/* char class */
class Char {
    constructor(First) {
        /* Save if this char is the first */
        this.First = First
        /* set a random char*/
        this.change()
    }
    update(now) {
        /* if were lucky */
        if (Math.floor(Math.random() * 60) == 0) {
            /* change the char */
            this.change()
        }
    }
    change() {
        /* pick a char between 0x30A0 and 0x30FF */
        this.str = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
    }
}

window.onresize = function () {
    /* Change local With and height variables */
    w = window.innerWidth
    h = window.innerHeight
    /* Change canvas With and height variables */
    document.getElementById("MyCanvas").width = w
    document.getElementById("MyCanvas").height = h
};
function step(now) {
    /* requests a new frame  */
    window.requestAnimationFrame(step);
    /* Creates a canvas that can be used to draw */
    var ctx = canvas.getContext("2d");
    /* Gets the current screen to make dimmer */
    imgData = ctx.getImageData(0, 0, w, h);
    /* for every pixel */
    for (var i = 0; i < imgData.data.length; i += 4) {
        /* dim the pixel's alpha channel by 2 */
        imgData.data[i + 3] /= 2
    }
    /* put the image back */
    ctx.putImageData(imgData, 0, 0)
    /* update every stream */
    streams.forEach(s => {
        s.update((now - last) / 1000)
    })
    /* Display every stream */
    streams.forEach(s => {
        s.display(ctx)
    })

    last = now

}