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

    let args = msg.content.split(' ')
    if(args.length != 2) return client.mpp.sendMessage('Invalid amount of arguments.')

    if(client.downloadLock) return client.mpp.sendMessage('There is a song currently being processed. Please wait.')

    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
        "outputPath": "./audio",    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    console.log(`Converting ${args[1].split('?v=')[1]}`)

    YD.download(args[1].split('?v=')[1]);

    YD.on("finished", function(err, data) {
        client.mpp.sendMessage(`Finished song download. Beginning midi translation AI.`)
        //Begin pianotrans
    });
    
    YD.on("error", function(error) {
        console.log(error)
        client.mpp.sendMessage('Error processing your request. Did you input a valid youtube url?')
    });
    
    YD.on("progress", function(progress) {
        client.mpp.sendMessage(`Downloading youtube video: %${progress.progress.percentage} | ETA: ${progress.progress.eta/60} mins`)
        console.log(JSON.stringify(progress))
    })
  }
}