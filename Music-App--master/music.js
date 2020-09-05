console.clear();


$(function(){
    var randomArr = [];
    var musicMain = document.getElementById('music-div');
    var musicList = $('#listMusic-div');
    var audio = document.getElementById('audio-ele');
    var song = document.getElementById('song-url');
    var playPause = document.getElementById('play-pause');
    var barWidth = document.getElementById('progress-bar').getClientRects()[0].width;
    // document.onload=function(){
    //     console.log("Ohkay")
    //     // audio.play();
    // }

$.get("http://5dd1894f15bbc2001448d28e.mockapi.io/playlist", function(e){
   for(var i=0; i<e.length-1; i++){
        musicList.append(createList(e[i].id, e[i].albumCover, e[i].track, e[i].artist, e[i].file))
        randomArr.push(e[i].id)
    }
});

setInterval(function(){
    var duration = Math.floor(audio.duration/60) + ": " +((audio.duration%60)/60).toFixed(2).split(".")[1];
    $('#song-duration').text(duration);
    $('#song-current-time').text(Math.floor(audio.currentTime))
},0);

function createList(id,url, name, artist, audios){
    var card = $('<div>').addClass('music-cards');
    card.id = id;
    var img = $('<img>').addClass('card-image').attr({
        src : url,
        alt : name
    })
    card.append(img)

    var desc = $('<div>').addClass('card-desc')
    var h3 = $('<h3>').addClass('card-heading').text(name);
    var p = $('<p>').addClass('card-author').text(artist);
    desc.append(h3,p);
    card.append(desc)

    card.click(function(e){
        $('#music-logo').attr({
            src: url,
            alt: name
        })
        $('#song').text(name);
        $('#artist').text(artist);
        audio.setAttribute('src',audios);
        musicMain.className = card.id
        $('#play-pause').get(0).className = "fas";
        $('#play-pause').addClass("fa-pause-circle")
        console.log(musicMain.classList[0])
    })

    return card;
}

playPause.onclick=function(){
    if(audio.paused){
        audio.play();
        $('#play-pause').get(0).className = "fas";
        $('#play-pause').addClass("fa-pause-circle")
    }else {
        audio.pause();
        $('#play-pause').get(0).className = "fas";
        $('#play-pause').addClass("fa-play-circle")
    }
}

function playNextSong(id){
    $.get('http://5dd1894f15bbc2001448d28e.mockapi.io/playlist/'+id,function(e){
        $('#music-logo').attr({
            src: e.albumCover,
            alt: e.track
        })
        $('#song').text(e.track);
        $('#artist').text(e.artist);
        audio.setAttribute('src',e.file);
        musicMain.className = e.id;
    })
}
$('#forward').click(function(){
    var id = Number(musicMain.classList[0])+1;
    if(id === 9){
        id = 1
        playNextSong(id)
    }
    playNextSong(id)
})

$('#backward').click(function(){
    var id = Number(musicMain.classList[0])-1;
    if(id === 0){
        playNextSong(randomArr[randomArr.length-1]);
    }
    else {
        playNextSong(id);
    }
})

var ranPrev = -1;
audio.ontimeupdate=function(){
    $('#progress-report').css({
        "width" : (barWidth * audio.currentTime)/audio.duration
    }) 
    if(audio.currentTime === audio.duration){
            if($('#shuffle').get(0).style.color === "blue"){
                var random = randomArr[Math.floor(Math.random() * randomArr.length)];
                if(random == ranPrev){
                    playNextSong(random+1)
                }
                else {
                    playNextSong(random)
                    ranPrev = random
                }
            }else{
                var id = Number(musicMain.classList[0])+1;
                if(id > 8){
                    id = 1
                }
                playNextSong(id)
                $('#play-pause').get(0).className = "fas";
                $('#play-pause').addClass("fa-pause-circle")
            }
       
    }
}

$('#progress-bar').click(function(e){
    var x = document.getElementById('progress-bar').getClientRects()[0].x;
    var coordinate = e.clientX;
    if(coordinate > x){
        var newWidth = coordinate - x;
        $('progress-report').css({"width":newWidth})
        audio.currentTime = (newWidth * audio.duration)/barWidth;
        audio.play();
    }
})

$("#volume").on({
    mousedown : function(e){
        console.log(e.clientX)
    }
})


$('#restart').click(function(e){
    audio.currentTime = 0
})

$('#shuffle').click(function(e){
    if($("#shuffle").css("color") === "rgb(21, 18, 75)"){
        $("#shuffle").css({"color" : "blue"})
    }else $("#shuffle").css({"color" : "rgb(21, 18, 75)"})
})


})




