import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection } from 'jsforce';
import { CreateSalesforceDto } from './salesforce.dto';

@Injectable()
export class SalesforceService implements OnModuleInit, OnModuleDestroy {
  private conn!: Connection;

  async onModuleInit() {
    this.conn = new Connection({
      instanceUrl: 'https://orgfarm-def2837e34.my.salesforce-setup.com/',
      oauth2: {
        loginUrl: 'https://orgfarm-def2837e34.my.salesforce.com',
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
      },
    });

    const userInfo = await this.conn.authorize({
      grant_type: 'client_credentials',
    });

    console.log({ userInfo });
  }

  async onModuleDestroy() {
    this.conn.logout();
  }

  async findContactById(sfId: string) {
    return await this.conn.sobject('Contact').findOne({
      Id: sfId,
    });
  }

  async updateContact(id: string, data: CreateSalesforceDto) {
    return await this.conn.sobject('Contact').update({
      Id: id,
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      Title: data.title,
    });
  }

  async createContact(data: CreateSalesforceDto) {
    return await this.conn.sobject('Contact').create({
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      Title: data.title,
    });
  }
}
