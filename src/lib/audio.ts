class AudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      
      // Resume context if suspended (browser security autoplays)
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, this.ctx.currentTime); // Low pitch click
      osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }

  playLevelUp() {
    try {
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      // Play 2 quick rising notes (like Minecraft XP sound!)
      const notes = [
        { freq: 932.33, time: 0 },   // A#5
        { freq: 1864.66, time: 0.08 } // A#6
      ];

      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        
        gain.gain.setValueAtTime(0.0, now + n.time);
        gain.gain.linearRampToValueAtTime(0.15, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + n.time + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + 0.28);
      });
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }
}

export const audioSynth = new AudioSynth();
