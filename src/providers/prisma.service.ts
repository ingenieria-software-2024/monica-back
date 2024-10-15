import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly #logger: Logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();

      this.#logger.debug(`Connected to database correctly.`);
    } catch (e) {
      this.#logger.error(`Error connecting to database: ${e}`);
      process.exit(0);
    }
  }
}
