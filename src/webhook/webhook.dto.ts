export interface WebhookDTO {
  id: number;
  scheduled_for: string;
  event: {
    id: string;
    resource: string;
    type:
      | 'charge:created'
      | 'charge:confirmed'
      | 'charge:failed'
      | 'charge:pending';
    api_version: string;
    created_at: string;
    data: {
      code: string;
      name: string;
      description: string;
      hosted_url: string;
      created_at: string;
      expires_at: string;
      timeline: [
        {
          time: string;
          status: string;
        },
      ];
      metadata: {
        email: string;
        name: string;
        phone: string;
      };
      pricing_type: string;
      payments: [];
      addresses: {
        bitcoin: string;
        ethereum: string;
      };
    };
  };
}
