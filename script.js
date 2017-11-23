      Char_Size = 16
      
          var w = window.innerWidth
          var h = window.innerHeight
      addEventListener('load', function (e) {
        str = ""
        for(var i = 0; i < Math.floor(window.innerWidth/Char_Size); i++){
          s = new Stream()
          s.x = Char_Size * i
          console.log("stream",s,i)
          streams.push(s)
        }
        
        canvas = document.getElementById("MyCanvas");
        
        w = window.innerWidth
        h = window.innerHeight
        
          document.getElementById("MyCanvas").width = w
          document.getElementById("MyCanvas").height = h
        /* starts frame updater */
        window.requestAnimationFrame(step);
      });
      streams = []
      var last = 0;
      class Stream {
        constructor() {
          this.size = Math.floor(Math.random()*20)+5
          this.Chars = []
          this.x = 0
          this.y = -600
          this.speed = Math.floor(Math.random()*100) + 10
          var first = Math.floor(Math.random()*5) == 0
          for(var i = 0; i < this.size; i ++){
            var c = new Char(first)
            this.Chars.push(c)
            first = false
          }
        }
        update(now){
          this.y += this.speed * now
          this.y %= h + (this.size * Char_Size)
          
          this.Chars.forEach(c => {
            c.update(now)
          })
        }
        display(ctx){
          
          ctx.font = Char_Size + "px Arial";
          for(var i = 0; i < this.size; i++){
            if(this.Chars[i].First)
              ctx.fillStyle="#3f3";
            else
              ctx.fillStyle="#080";
            var x = this.x
            var y = this.y - Char_Size * i
            //alert(x+ "<"+y)
            ctx.fillText( this.Chars[i].str,x,y);
          }
        }
      }
      class Char {
        constructor(First) {
          this.First = First
          this.change()
          this.till = Math.random()*10
        }
        update(now){
          if(Math.floor(Math.random()*60) == 0){
            //alert("Changed")
            this.change()
            now += Math.random()*10
          }
        
        }
        change(){
          this.str = String.fromCharCode(0x30A0 + Math.floor(Math.random()*96))
        }
      }
      window.onresize = function(){
          w = window.innerWidth
          h = window.innerHeight
          document.getElementById("MyCanvas").width = w
          document.getElementById("MyCanvas").height = h};
      function step(now) {
        window.requestAnimationFrame(step);
        /*if(w != window.innerWidth || h != window.innerHeight){
          var w = window.innerWidth
          var h = window.innerHeight
          document.getElementById("MyCanvas").width = w
          document.getElementById("MyCanvas").height = h
        }*/
        
        var ctx = canvas.getContext("2d");
        t1 = performance.now()
        imgData = ctx.getImageData(0, 0, w, h);
        //console.log(imgData)
        for(var i = 0; i < imgData.data.length; i+=4){
          imgData.data[i+3] /= 2
        }
        ctx.putImageData(imgData,0,0)
        t2 = performance.now()
        console.log("Darken ",1/(t2-t1)*1000)
        
        t1 = performance.now()
        streams.forEach(s =>{
          s.update((now-last)/1000)
        })
        t2 = performance.now()
        console.log("Update ",1/(t2-t1)*1000)
        t1 = performance.now()
        streams.forEach(s =>{
          s.display(ctx)
        })
        t2 = performance.now()
        console.log("add ",1/(t2-t1)*1000)
        //console.log(1/(now-last)*1000)
        last = now
        
        //console.log("Frame")
        
      }
