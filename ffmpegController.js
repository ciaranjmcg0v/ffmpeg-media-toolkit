const { spawn } = require('child_process');
const path = require('path');

// Construct the relative path to the ffmpeg_converter.sh script
const ffmpegScript = path.join(__dirname, 'ffmpeg_converter.sh');
const inputDirectory = ""; // Insert path to input directory
const outputDirectory = ""; // Insert path to output directory

const ffmpegProcess = spawn(ffmpegScript, [inputDirectory, outputDirectory]);

let lastFilename = '';
let totalDuration = 0; // Store total duration in seconds
let lastProgress = -1; // Initialize to -1 to allow progress updates

ffmpegProcess.stdout.on('data', (data) => {
    const output = data.toString();
    
    // Split the output into lines
    const outputLines = output.split('\n');
    outputLines.forEach(line => {
        // Match filename processing
        const filenameMatch = line.match(/Current conversion: (.+?),/);
        if (filenameMatch) {
            const filename = filenameMatch[1].trim();
            if (filename !== lastFilename) {
                lastFilename = filename; // Update the last filename
            }
        }

        // Match total duration
        const durationMatch = line.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (durationMatch) {
            const hours = parseFloat(durationMatch[1]);
            const minutes = parseFloat(durationMatch[2]);
            const seconds = parseFloat(durationMatch[3]);
            totalDuration = hours * 3600 + minutes * 60 + seconds; // Convert total duration to seconds
        }

        // Match current output time
        const progressMatch = line.match(/out_time=([0-9:.]+)/);
        if (progressMatch) {
            const currentTimeMatch = progressMatch[1];
            const [currHours, currMinutes, currSeconds] = currentTimeMatch.split(':').map(Number);
            const currentTime = currHours * 3600 + currMinutes * 60 + currSeconds; // Convert current time to seconds
            
            if (totalDuration > 0) {
                const scaledProgress = (currentTime / totalDuration) * 100; // Calculate percentage of total
                if (scaledProgress !== lastProgress) {
                    // Update progress on the same line
                    process.stdout.write(`\rProcessing file: ${lastFilename}, Progress: ${scaledProgress.toFixed(2)}%`);
                    lastProgress = scaledProgress; // Update the last progress
                }
            }
        }
    });
});

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data.toString()}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`\nFFmpeg process exited with code ${code}`);
    console.log(); // For new line after progress output
});
