function formatTime(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

class Timer {
  time : number
  constructor() {
    this.time = Date.now()
  }

  log(msg?: string) {
    if (!msg){
      msg = "Milliseconds since last"
    }
    console.log(`${msg} : ${Date.now() - this.time}`)
    this.time = Date.now()
  }
}

export { formatTime, Timer };
