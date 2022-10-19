import { Component } from '@angular/core';

interface song{
  title: string
  artist: string
  picture: string
  album: string
  genre: string
  year: string
  songData: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  currentSong : song = {} as song;

  songs : song[] = []

  progressValue = 0;
  curSongDurInSecs= 0
  currentSongDuration= "00:00"
  currentSongPlayTime= "00:00"
  songIndex= 0
  isPlaying = false
  loadSongData = false
  isRandom = false
  deletedSong = ""
  showPlaylist = false
  snackbarText = ""

  title = 'music-player';

  loadSong(index : number){
    this.currentSong = this.songs[index]
    // document.getElementById('audio').src = this.currentSong.songData
    // document.getElementById('audio').addEventListener('timeupdate', () => {
      
    // })
    document.getElementById('audio').addEventListener('loadeddata', async () => {
      this.setCurrentSongDuration()
      this.loadSongData = true
      this.curSongDurInSecs = document.querySelector('audio').duration
      if (this.isPlaying = true) {
        document.getElementById('audio').play()
      }
    })
    document.getElementById('audio').addEventListener('ended', this.playNextSong)
  }

  timeUpdateMeth(){
    this.updateSlider()
    this.setCurrentPlayTime()
  }

  load

  readMusicMetadata(){
    const jsmediatags = window.jsmediatags
    const files = document.getElementById('musicFileSelector').files
    for (let i = 0; i < files.length; i++) {
      const fileReader = new FileReader()
      jsmediatags.read(files[i], {
        onSuccess: (result) => {
          let rs = 'title' in result.tags
          let newSong = {title: "", artist: "", album: "", picture: "", genre: "", year: "", songData: ""}
          if('picture' in result.tags){
            const { data, format } = result.tags.picture;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);
            }
            newSong.picture = `data:${data.format};base64,${window.btoa(base64String)}`;
          }
          else{
            newSong.picture = "/mp3-image.png"
          }
          newSong.title = ('title' in result.tags) ? result.tags.title : files[i].name;
          newSong.artist = ('artist' in result.tags) ? result.tags.artist : "Unknown";
          newSong.album = ('album' in result.tags) ? result.tags.album : "Unknown";
          newSong.genre = ('genre' in result.tags) ? result.tags.genre : "Unknown";
          newSong.year = ('year' in result.tags) ? result.tags.year : "Unknown";
          fileReader.readAsDataURL(files[i])
          fileReader.onload = () => {
            newSong.songData = fileReader.result
            this.songs.push(newSong)
          }
        },
        onError:  (error) => {
          console.log(error);
        }
      })
    }
  },
  addSongsToPlaylist(){
    document.getElementById('musicFileSelector').click()
  },
  playThisSong(song : song){
    if (this.currentSong == "") {
      this.loadSong(this.songs.indexOf(song))
      this.songIndex = this.songs.indexOf(song)
      this.isPlaying = true
      return
    }
    this.currentSong = song
    this.songIndex = this.songs.indexOf(song)
    this.isPlaying = true
  },
  play(){
    if(this.songs.length == 0){
      this.snackbar("no songs")
      return
    }
    if (this.currentSong == "") {
      this.loadSong(this.songIndex)
      this.isPlaying = true
      return
    }
    document.getElementById('audio').play()
    this.isPlaying = true
    // let element = document.getElementById('discBann')
    // element.style.animationPlayState ='running';
  },
  pause(){
    document.getElementById('audio').pause()
    this.isPlaying = false
    // let element = document.getElementById('discBann')
    // element.style.animationPlayState = 'paused'
  },
  updateSlider(){
    this.progressValue = document.getElementById('audio').currentTime
  },
  seek(){
    document.getElementById('audio').currentTime = this.progressValue
  },
  setCurrentSongDuration(){
    let minutes = (Math.floor(document.getElementById('audio').duration / 60)).toString().padStart(2,'0');
    let seconds = (Math.floor(document.getElementById('audio').duration - minutes * 60)).toString().padStart(2,'0');
    this.currentSongDuration = minutes + ":" + seconds
  },
  setCurrentPlayTime(){
    let minutes = (Math.floor(document.getElementById('audio').currentTime / 60)).toString().padStart(2,'0');
    let seconds = (Math.floor(document.getElementById('audio').currentTime - minutes * 60)).toString().padStart(2,'0');
    this.currentSongPlayTime = minutes + ":" + seconds
  },
  playNextSong(){
    if(this.songs.length == 0){
      this.snackbar("no songs")
      return
    }
    if (this.isRandom == true) {
      this.pickRandomSong()
      return
    }
    this.songIndex ++
    if (this.songIndex == (this.songs.length)) {
      this.songIndex = 0
    }
    this.currentSong = this.songs[this.songIndex]
    document.getElementById('audio').src = this.currentSong.songData
  },
  playPreviousSong(){
    if(this.songs.length == 0){
      this.snackbar("no songs")
      return
    }
    this.songIndex --
    if (this.songIndex == -1) {
      this.songIndex = (this.songs.length -1)
    }
    this.currentSong = this.songs[this.songIndex]
    document.getElementById('audio').src = this.currentSong.songData
  },
  removeSongFromPlaylist(song){
    this.deletedSong = song
    this.songs.splice(this.songs.indexOf(song), 1)
    this.snackbar("delete")
  },
  pickRandomSong(clicked){
    if(this.currentSong == "")
      return
    if (clicked == "clicked") {
      this.isRandom = !this.isRandom;
      (this.isRandom == true) ? document.getElementById('shuffleBtnIcon').style.color = "black" : document.getElementById('shuffleBtnIcon').style.color = "gray"
    }
    if (this.isRandom == false) {
      this.songIndex = this.songs.indexOf(this.currentSong)
      return
    }
    if (this.isRandom == true && this.isPlaying == true && clicked == 'clicked') {
      return
    }
    let randNum = Math.floor(Math.random() * this.songs.length)
    this.currentSong = this.songs[randNum]
    this.songIndex = this.songs.indexOf(this.currentSong)
  },
  snackbar(action) {
    var x = document.getElementById("snackbar");
    
    if(action == "delete"){
      this.snackbarText = "Undo"
      x.addEventListener("click", this.undoDelete)
    }
    else if(action == "no songs"){
      this.snackbarText = "You have no song to play"
      x.removeEventListener("click", this.undoDelete)
    }
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  },
  undoDelete(){
    this.songs.push(this.deletedSong)
  }


}
