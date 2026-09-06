import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@users/config';
import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersElasticSearchServer', 'debug');

const elasticSearchClient = new Client({ node: `${config.ELASTIC_SEARCH_URL}` || 'http://localhost:9200' });

const checkElasticSearchConnection = async (): Promise<void> => {
  let isConnected: boolean = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`UsersService ElasticSearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('ElasticSearch connection failed. Retrying in 5 seconds...', error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      log.log('error', 'UsersService checkElasticSearchConnection() method error.', error);
    }
  }
};

export { checkElasticSearchConnection };
