# FFmpeg Media Toolkit

## Overview

The **FFmpeg Media Toolkit** is a command-line utility designed to convert video files in various formats to a specified output format using FFmpeg. This application processes video files in a designated input directory and outputs the converted files to a specified output directory while providing real-time progress updates in the console.

## Features

- Converts video files from `.MOV` and `.MP4` formats to `.MP4` using the x265 codec.
- Displays real-time progress updates during the conversion process.
- Supports `.MOV` and `.MP4` formats in the specified input directory.

## Installation

To run this application, ensure you have FFmpeg installed on your system. Clone this repository and navigate to the project directory:

```bash
git clone https://github.com/ciaranjmcg0v/ffmpeg-media-toolkit
cd ffmpeg-media-toolkit
```

Make sure the script is executable:

```bash
chmod +x ffmpeg_converter.sh
```

## Usage

To start the conversion process, run the following command in your terminal:

Ensure that the paths for the input and output directories in the script are set correctly.

```bash
node ffmpegController.js
```

## Current Operating System

- **EndeavourOS** (Arch Linux)

The toolkit is also intended to be compatible with Windows and Mac systems.

## To-Do List

- Scan the input directory to calculate the number of video files to be converted.
- Append the current video from the total number of videos that is calculated (e.g., [video 4 of 12]).
- Extend the script to search for different video formats or include all video formats.
- Create a UI interface that allows the user to choose and pass in the parameters for the script (e.g., codec type [x265/x264], output format [.MP4, .MKV], output filename, and directory). The UI will let the user choose settings and inject the specified parameters into the script before running it, capturing the output (e.g., "Conversion in progress -> [file 2 of 38]: IMG_4185.MOV - Progress: 30.94%") and rendering it in the UI.
- Add ENV variables to account for different operating system and add a function to switch between directory paths based on current OS.
- Explore streaming options for local network.

## Contributing

Feel free to contribute to the project by submitting issues or pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Instructions

1. Replace `<repository-url>` with the actual URL of your repository.
2. Review the content to ensure it fits your project specifics.
