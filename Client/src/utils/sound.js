// Sound effect utility for the Tic Tac Toe game
class SoundEffects {
    constructor() {
      this.newSound = new Audio('/sounds/newGame.wav');
      this.winSound = new Audio('/sounds/win.wav');
      this.drawSound = new Audio('/sounds/gameDraw.wav');
      this.clickSound = new Audio('/sounds/mixkit-cooking-stopwatch-alert-1792.wav');
      this.errorSound = new Audio('/sounds/error.mp3');
      
      // Preload sounds
      this.newSound.load();
      this.winSound.load();
      this.drawSound.load();
      this.clickSound.load();
      this.errorSound.load();
    }
  
    playNew() {
      this.newSound.currentTime = 0;
      this.newSound.play().catch(e => console.log('Sound play error:', e));
    }
  
    playWin() {
      this.winSound.currentTime = 0;
      this.winSound.play().catch(e => console.log('Sound play error:', e));
    }
  
    playDraw() {
      this.drawSound.currentTime = 0;
      this.drawSound.play().catch(e => console.log('Sound play error:', e));
    }
  
    playClick() {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(e => console.log('Sound play error:', e));
    }
  
    playError() {
      this.errorSound.currentTime = 0;
      this.errorSound.play().catch(e => console.log('Sound play error:', e));
    }
  }
  
  // Create a singleton instance
  const soundEffects = new SoundEffects();
  export default soundEffects;