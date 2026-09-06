import { config } from '@users/config';
import { createRabbitMQConnection } from '@users/queues/connection';
import { publishDirectMessage } from '@users/queues/user.producer';
import { createBuyer, updateBuyerPurchasedGigs } from '@users/services/buyer.service';
import {
  getRandomSellers,
  updateSellerCancelledJobs,
  updateSellerCompletedJobs,
  updateSellerOnGoingJobs,
  updateSellerReview,
  updateTotalGigsCount
} from '@users/services/seller.service';
import { IBuyerDocument, ISellerDocument, winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userServiceConsumer', 'debug');

const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    const exchangeName = 'jobber-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    log.info(' [*] Waiting for messages in %s.', jobberQueue.queue);
    channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async function (messsage: ConsumeMessage | null) {
      const { type } = JSON.parse(messsage!.content.toString());
      if (type === 'auth') {
        const { username, email, profilePicture, country, createdAt } = JSON.parse(messsage!.content.toString());
        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };
        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(messsage!.content.toString());
        await updateBuyerPurchasedGigs(buyerId, purchasedGigs, type);
      }
      channel.ack(messsage!);
    });
  } catch (error) {
    log.log('error', 'UserConsumer consumeBuyerDirectMessage() method error.', error);
  }
};

const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    const exchangeName = 'jobber-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    log.info(' [*] Waiting for messages in %s.', jobberQueue.queue);
    channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async function (messsage: ConsumeMessage | null) {
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
        messsage!.content.toString()
      );
      const handleDirectMessages: Record<string, () => Promise<void>> = {
        'create-order': async () => {
          await updateSellerOnGoingJobs(sellerId, ongoingJobs);
        },
        'approved-order': async () => {
          await updateSellerCompletedJobs({ sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery });
        },
        'update-gigs-count': async () => {
          await updateTotalGigsCount(`${gigSellerId}`, count);
        },
        'cancel-order': async () => {
          await updateSellerCancelledJobs(sellerId);
        }
      };

      const handler = handleDirectMessages[type];

      if (!handler) {
        throw new Error(`Unsupported order type: ${type}`);
      }

      await handler();
      channel.ack(messsage!);
    });
  } catch (error) {
    log.log('error', 'UserConsumer consumeBuyerDirectMessage() method error.', error);
  }
};

const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = await createRabbitMQConnection();
    }

    const exchangeName = 'jobber-review';
    const queueName = 'seller-seller-queue';

    await channel.assertExchange(exchangeName, 'fanout');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, '');

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'buyer_review') {
        await updateSellerReview(JSON.parse(msg!.content.toString()));
        await publishDirectMessage(
          channel,
          'jobber-update-gig',
          'update-gig',
          JSON.stringify({ type: 'updateGig', gigReview: msg!.content.toString() }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {}
};

const consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createRabbitMQConnection()) as Channel;
    }
    const exchangeName = 'jobber-gig';
    const routingKey = 'get-sellers';
    const queueName = 'user-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'getSellers') {
        const { count } = JSON.parse(msg!.content.toString());
        const sellers: ISellerDocument[] = await getRandomSellers(parseInt(count, 10));
        await publishDirectMessage(
          channel,
          'jobber-seed-gig',
          'receive-sellers',
          JSON.stringify({ type: 'receiveSellers', sellers, count }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeReviewFanoutMessages() method error:', error);
  }
};

export { consumeBuyerDirectMessage, consumeReviewFanoutMessages, consumeSeedGigDirectMessages, consumeSellerDirectMessage };
