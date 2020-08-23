# StreamBot

A discord written in C# that streams local machine audio to a voice channel.

Utilizes dotnet discord-net library: https://github.com/discord-net/Discord.Net

# Native libraries needed
libsodium: https://download.libsodium.org/libsodium/releases/

opus: https://ftp.osuosl.org/pub/xiph/releases/opus/


# Commandline tool for creating audio pipes
ffmpeg: https://ffmpeg.org/download.html

# Setup
Create and obtain your bot token from discord.com
https://discord.com/developers/applications

Insert your bot token to set_env.sh, to be exported as an environment variable

Run with:
```
./set_env.sh
dotnet run
```
# 
