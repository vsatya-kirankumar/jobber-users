import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { config } from '@users/config';
import { Logger } from 'winston';
import amqp, { Channel, ChannelModel } from 'amqplib';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userQueueConnection', 'debug');

export async function createRabbitMQConnection(): Promise<Channel> {
  try {
    log.info('User-service: Creating connection to RabbitMQ...');

    const connection: ChannelModel = await amqp.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('User server successfully connected to RabbitMQ.');
    closeConnection(connection, channel);
    return channel;
  } catch (error) {
    log.log('error', 'Users service createRabbitMQConnection() method error', error);

    throw error;
  }
}

function closeConnection(connection: ChannelModel, channel: Channel): void {
  process.once('SIGINT', async () => {
    try {
      await channel.close();
      await connection.close();
      log.info('RabbitMQ User connection closed gracefully.');
      process.exit(0);
    } catch (error) {
      log.error('error', 'Error closing RabbitMQ Auth connection:', error);
      process.exit(1);
    }
  });
}
