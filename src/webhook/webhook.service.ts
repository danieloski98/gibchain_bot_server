import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { WebhookDTO } from './webhook.dto';
import { EmailServiceService } from 'src/email-service/email-service.service';

@Injectable()
export class WebhookService {
  constructor(
    private databaseService: DatabaseService,
    private EmailService: EmailServiceService,
  ) {}

  private async chargeCreated(body: WebhookDTO) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: body.event.data.metadata.email,
      },
    });

    if (user === null) {
      console.log('----USER NOT FOUND---');
      return;
    }

    // CHECK FOR PAYMENT
    const payment = await this.databaseService.payment.findFirst({
      where: {
        payment_id: body.event.id,
      },
    });

    if (payment === null) {
      await this.databaseService.payment.create({
        data: {
          payment_id: body.event.id,
          telegram_id: user.telegram_id,
          status: 'created',
        },
      });
    }
  }

  private async chargeConfirmed(body: WebhookDTO) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: body.event.data.metadata.email,
      },
    });

    if (user === null) {
      console.log('----USER NOT FOUND---');
      return;
    }
    const transaction = await this.databaseService.payment.findFirst({
      where: {
        payment_id: body.event.id,
      },
    });

    if (transaction !== null) {
      await this.databaseService.payment.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: 'confirmed',
        },
      });
      await this.EmailService.sendPaymentConfirmationEmail({
        email: user.email,
        message: '',
      });
    }
  }

  private async chargeFailed(body: WebhookDTO) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: body.event.data.metadata.email,
      },
    });

    if (user === null) {
      console.log('----USER NOT FOUND---');
      return;
    }

    const transaction = await this.databaseService.payment.findFirst({
      where: {
        payment_id: body.event.id,
      },
    });

    if (transaction !== null) {
      await this.databaseService.payment.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: 'failed',
        },
      });

      await this.EmailService.sendPaymentFaliedEmail({
        email: user.email,
        message: '',
      });
    }
  }

  async handleWebhookEvent(body: WebhookDTO) {
    switch (body.event.type) {
      case 'charge:created': {
        this.chargeCreated(body);
        break;
      }
      case 'charge:confirmed': {
        this.chargeConfirmed(body);
        break;
      }
      case 'charge:failed': {
        this.chargeFailed(body);
        break;
      }
    }
    return {
      message: 'completed',
    };
  }
}
