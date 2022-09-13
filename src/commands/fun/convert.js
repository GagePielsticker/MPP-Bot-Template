const Command = require('../command.js')
const YoutubeMp3Downloader = require("youtube-mp3-downloader");


module.exports = class Convert extends Command {
  constructor (client) {
    super('convert', [], 'Converts mp3 / wav files to midi using AI.', {
      usage: `${client.settings.prefix}convert {YOUTUBE URL}`,
      category: 'fun'
    })
  }

  async run (client, msg) {
    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
        "outputPath": "./audio",    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    YD.download("Vhd6Kc4TZls");

    YD.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
    });
    
    YD.on("error", function(error) {
        console.log(error);
    });
    
    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress));
    });

  }
}