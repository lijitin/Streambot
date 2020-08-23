using System;
using System.Configuration;
using System.Threading.Tasks;
using Discord;
using Discord.WebSocket;
using Discord.Commands;
using Discord.Audio;

using Microsoft.Extensions.DependencyInjection;

using StreamBot.Services;

namespace StreamBot{
    public class Program
    {
        public static void Main(string[] args)
            => new Program().MainAsync().GetAwaiter().GetResult();

        public async Task MainAsync()
        {
            using(var _services = ConfigureServices())
            {
                var _client = _services.GetRequiredService<DiscordSocketClient>();
                

                _client.Log += LogAsync;
                _services.GetRequiredService<CommandService>().Log += LogAsync;

                await _client.LoginAsync(TokenType.Bot, 
                    Environment.GetEnvironmentVariable("StreamBotToken"));
                await _client.StartAsync();

                await _services.GetRequiredService<CommandHandlerService>().InitializeAsync(); // read in the command modules

                await Task.Delay(-1);   
            };
        }

        private Task LogAsync(LogMessage msg)
        {
            Console.WriteLine(msg.ToString());
            return Task.CompletedTask;
        }

        // configure services / DI here
        private ServiceProvider ConfigureServices()
        {
            var services = new ServiceCollection()
            .AddSingleton<IDummyService, DummyService>()
            .AddSingleton<CommandService>()
            .AddSingleton<DiscordSocketClient>()
            .AddSingleton<CommandHandlerService>()
            .AddSingleton<AudioService>()
            .BuildServiceProvider(); // <-
            return services;
        }

    }   
}
