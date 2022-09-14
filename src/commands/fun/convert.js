const Command = require('../command.js')
const YoutubeMp3Downloader = require("youtube-mp3-downloader")
const path = require("path");
const { exec, spawn } = require('node:child_process');
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
        "outputPath": "./",    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    let parsedURL = args[1].split('?v=')[1]

    await yt.info(parsedURL).then(v => {
        if(v.length_seconds > 480) {
            client.sendMessage('Videos longer then 8 mins disabled.')
            client.downloadLock = false
            return
        } else YD.download(parsedURL)
    })

    YD.on("finished", function(err, data) {

        client.mpp.sendMessage(`@${msg.author.id} Finished song download. Beginning midi translation AI.`)
        let date = +new Date()

        exec(`PATH=$PATH:/root/.nix-profile/bin:/nix/store/sz84dqhk99i6mp1ilj1ja8kyspji0jdl-pianotrans-1.0/bin:/root/.nix-profile/bin:/nix/var/nix/profiles/default/bin && mv \'${data.title}.mp3\' ${date}.mp3`, {
            shell:'/bin/bash'
        }, (err, out) => {
            let worker = spawn('/nix/var/nix/profiles/default/bin/pianotrans', [`${date}.mp3`])

            worker.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            });

            worker.on('close', (code) => {
            if (code !== 0) {
                console.log(`ps process exited with code ${code}`);
            }
            grep.stdin.end();
            });
            console.log(err)
            console.log(out)
        })
        
        // exec(`cd ./audio/ && mv ./'${data.title}.mp3' ./${date}.mp3 && /nix/store/bx33y97w30d5i4d3r0jrsc5gh6fmrfkv-profile/bin/pianotrans ${date}.mp3`, (err, output) => {
        //     if (err) return console.error("could not execute command: ", err)
        //     client.mpp.sendMessage('Warming up machine learning model... This could take a sec..')
        //     console.log(output)
        //     if(output.startsWith('Segment')) {
        //         console.log(`Running conversion, progress: ${output.replace('Segment ', '')}`)
        //     }
        // })
    });
    
    YD.on("error", function(error) {
        client.mpp.sendMessage('Error processing your request. Did you input a valid youtube url?')
    });
    
    YD.on("progress", function(progress) {
        client.mpp.sendMessage(`Downloading youtube video, ETA: ${(progress.progress.eta/60).toFixed(1)} mins`)
        console.log(JSON.stringify(progress))
    })
  }
}