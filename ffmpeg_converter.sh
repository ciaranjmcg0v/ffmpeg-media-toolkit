#!/bin/bash

# Set input and output directories from command line arguments
inputDir="$1"
outputDir="$2"
ffmpegPath="/usr/bin/ffmpeg" # Adjust if ffmpeg is in a different location

# Create output directory if it doesn't exist
mkdir -p "$outputDir"

# Check if input directory exists
if [ ! -d "$inputDir" ]; then
    echo "Input directory does not exist: $inputDir"
    exit 1
fi

echo "Input directory: $inputDir"
echo "Output directory: $outputDir"

# Loop through .MOV and .MP4 files in the input directory
shopt -s nullglob  # Ensure the loop does not run if no files are found
found_files=false

for inputFile in "$inputDir"/*.MOV "$inputDir"/*.MP4; do
    if [ -e "$inputFile" ]; then
        found_files=true
        outputFile="$outputDir/$(basename "${inputFile%.*}.mp4")"

        echo "Processing file: $inputFile"

        # Get the total duration of the video for percentage calculation
        duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$inputFile")
        if [ -z "$duration" ]; then
            echo "Could not retrieve duration for: $inputFile"
            continue
        fi

        # Run the FFmpeg command and capture output
        $ffmpegPath -i "$inputFile" -c:v libx265 -preset fast -crf 23 -c:a aac -b:a 256k "$outputFile" -progress pipe:1 2>&1 | \
        while IFS= read -r line; do
            # Print each line for debugging
            echo "$line"
            # Check for the line containing the progress percentage
            if [[ $line == *"out_time_ms="* ]]; then
                # Extract the milliseconds
                ms=$(echo "$line" | grep -oP 'out_time_ms=\K[0-9]+')
                if [ -n "$ms" ]; then
                    # Calculate the progress percentage
                    total_ms=$(echo "$duration * 1000" | bc)
                    progress=$(echo "scale=2; ($ms / $total_ms) * 100" | bc)
                    echo -ne "Current conversion: $(basename "$inputFile"), Progress: ${progress}%\r"
                fi
            fi
        done 

        # Ensure the final message is printed after the conversion completes
        echo -e "\nCompleted processing: $(basename "$inputFile")"
    fi
done

if [ "$found_files" = false ]; then
    echo "No video files found in $inputDir"
fi

echo "Conversion complete."
