const Command = require('../command.js')
const YoutubeMp3Downloader = require("youtube-mp3-downloader")
const path = require("path");
const { exec } = require('node:child_process');
const yt = require('youtube-info-streams')

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

    if(client.downloadLock) return client.mpp.sendMessage(`@${msg.author.id} There is a song currently being processed. Please wait.`)
    else client.mpp.sendMessage(`@${msg.author.id} Starting download...`)

    client.downloadLock = true

    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
        "outputPath": "./audio",    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    let parsedURL = args[1].split('?v=')[1]

    let date = +new Date()

    await yt.info(parsedURL).then(v => {
        if(v.player_response.videoDetails.lengthSeconds > 480 || v.player_response.videoDetails.isLiveContent) {
            client.mpp.sendMessage('Videos longer then 8 mins and streams are disabled.')
            client.downloadLock = false
            return
        } else YD.download(parsedURL, `${date}.mp3`)
    })
    .catch(e => {
        client.mpp.sendMessage('Video not available.')
        client.downloadLock = false
        return
    })

    YD.on("finished", function(err, data) {

        client.mpp.sendMessage(`@${msg.author.id} Finished song download.`)

        let string = `PATH=$PATH:/root/.nix-profile/bin:/nix/store/sz84dqhk99i6mp1ilj1ja8kyspji0jdl-pianotrans-1.0/bin:/root/.nix-profile/bin:/nix/var/nix/profiles/default/bin && cd ./audio/ && python3 ./runmodel.py --audio_path=./${date}.mp3 --output_midi_path='./${date}.mid'`

        client.mpp.sendMessage('Warming up and running machine learning model... This could take a sec (or mins)..')
        let running = false

        let i = 0
        let updateInt = setInterval(() => {
            i++
            client.mpp.sendMessage(`Machine Learning Model Running... Please be patient :: ${i}`)
        }, 8000)
        exec(string, {
            shell:'/bin/sh'
        }, (err, out) => {

            if (err) {
                console.log()
                clearInterval(updateInt)
                client.mpp.send(`Internal error trying to execute.`)
                console.error("could not execute command: ", err)
                client.downloadLock = false
                return
            }

            clearInterval(updateInt)
            exec(`cd ./audio && mv ${date}.mid /var/www/html`, (err, out) => {
                if (err) {
                    client.mpp.send(`Internal error trying to execute.`)
                    console.error("could not execute command: ", err)
                    client.downloadLock = false
                    return
                }

                client.mpp.sendMessage(`Uploaded! Find your midi file here https://khai.dog/${date}.mid ! It will expire in 10 mins.`)
                client.downloadLock = false
                
                setTimeout(() => {
                    exec(`rm /var/www/html/${date}.mid`)
                }, 600000)

            })

            console.log(out)
            if(out.startsWith('Segment')) {
                console.log(`Running conversion, progress: ${out.replace('Segment ', '')}`)
            }
        })
    });
    
    YD.on("error", function(error) {
        console.log(error)
        client.mpp.sendMessage('Error processing your request. Did you input a valid youtube url?')
        client.downloadLock = false
    });
    
    YD.on("progress", function(progress) {
        client.mpp.sendMessage(`Downloading youtube video, ETA: ${(progress.progress.eta/60).toFixed(1)} mins`)
        console.log(JSON.stringify(progress))
    })
  }
}