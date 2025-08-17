import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handlerCommandInteraction, registerCommands } from './commands';
import { SnsAggregatorService } from './snsaggregator';
import { router } from './routes';
import { init_encrypted_maps } from './encrypted_maps';
import { registerProgressBarEmojis } from './utils';

dotenv.config({ path: '../../.env' });

async function initDiscord(): Promise<Client> {
  const client = new Client({ intents: [] });

  client.on(Events.ClientReady, async readyClient => {
    await registerCommands(client);
    await registerProgressBarEmojis(readyClient);
    console.log(`Logged in as ${readyClient.user.tag}!`);
  });

  client.on(Events.InteractionCreate, async interaction => {
    await handlerCommandInteraction(interaction)
  });

  await client.login(process.env.DISCORD_BOT_TOKEN!);
  return client;
}

async function initServer(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({})

  server.register(fastifyCors);
  server.register(router);

  await server.listen({ port: 3000 });
  console.log("Listening on 3000");
  return server;
}

async function start() {
  try {
    init_encrypted_maps();
    await SnsAggregatorService.init();

    const client = await initDiscord();
    const server = await initServer();
  } catch (err) {
    process.exit(1)
  }
}

start()