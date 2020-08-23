using System;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;

using Microsoft.Extensions.DependencyInjection;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Discord.Audio;

using StreamBot.Services;

public class VCModule : ModuleBase<SocketCommandContext>
{
    private readonly AudioService _audioService;
    public VCModule(AudioService audioService)
    {
        _audioService = audioService;
    }

    // The command's Run Mode MUST be set to RunMode.Async, otherwise, being connected to a voice channel will block the gateway thread.
    [Command("join", RunMode = RunMode.Async)] 
    public async Task joinChannel(IVoiceChannel channel = null)
    {
        // Get the audio channel
        channel = channel ?? (Context.User as IGuildUser)?.VoiceChannel;
        if (channel == null) { await Context.Channel.SendMessageAsync("User must be in a voice channel, or a voice channel must be passed as an argument."); return; }

        // For the next step with transmitting audio, you would want to pass this Audio Client in to a service.
        var audioClient = await channel.ConnectAsync();

    }
    [Command("stream", RunMode = RunMode.Async)]
    public async Task stream(IVoiceChannel channel = null)
    {
        // Get the audio channel
        channel = channel ?? (Context.User as IGuildUser)?.VoiceChannel;
        if (channel == null) { await Context.Channel.SendMessageAsync("User must be in a voice channel, or a voice channel must be passed as an argument."); return; }

        // For the next step with transmitting audio, you would want to pass this Audio Client in to a service.
        var audioClient = await channel.ConnectAsync();
        
        await audioClient.SetSpeakingAsync(true);
        var psi = new ProcessStartInfo
        {
            FileName = "ffmpeg",
            Arguments = $@"-f pulse -i default -ac 2 -f s16le -ar 48000 pipe:1",
            RedirectStandardOutput = true,
            UseShellExecute = false
        };
        var ffmpeg = Process.Start(psi);

        var output = ffmpeg.StandardOutput.BaseStream;
        var discord = audioClient.CreatePCMStream(AudioApplication.Voice);
        await output.CopyToAsync(discord);
        await discord.FlushAsync();
    }

    [Command("amq")]
    [Summary("Login to AMQ on spector.")]
    public async Task amqAsync()
    {
        await Context.Channel.SendMessageAsync("Logging in to AMQ as user - spector.");   
        var psi = new ProcessStartInfo
        {
            FileName = "python3",
            Arguments = "./py/autologin.py",
            RedirectStandardOutput = true
        };
        var pyproc = Process.Start(psi);
        
        StreamReader reader = pyproc.StandardOutput;
        string output = await reader.ReadToEndAsync();
        output = output.Trim();
        string msg = null;
        if(output.Contains('o')) // amq ranked online, ok
        {
            msg = "AMQ ranked is online. Type !stream to stream audio.";
            
        }else
        {
            msg = $"AMQ ranked is currently offline. ({output})";
        }
        await Context.Channel.SendMessageAsync(msg);        
    }
    [Command("quit")]
    [Summary("Leave the channel")]
    public async Task quit()
    {

    }
}