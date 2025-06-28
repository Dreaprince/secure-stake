import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VerifyMeService {
  private accessToken: string | null = null;
  private tokenExpirationTime: Date | null = null;

  constructor(private readonly httpService: HttpService) {}

  // Get the access token to make authenticated requests to VerifyMe API
  private async getToken(): Promise<string> {
    if (!this.needsRefresh()) return this.accessToken;

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${process.env.NEW_VERIFYME_URL}/token`,
          {
            secret: process.env.NEW_VERIFYME_SECRET_KEY,
            clientId: process.env.NEW_VERIFYME_Client_ID,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      this.accessToken = response.data.accessToken;
      this.tokenExpirationTime = new Date(Date.now() + response.data.expiresIn * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Error while obtaining token:', error);
      throw error;
    }
  }

  private needsRefresh(): boolean {
    return !this.accessToken || this.tokenExpirationTime <= new Date();
  }

  // TIN Verification
  async TINVerification(TIN: string) {
    try {
      const token = await this.getToken();
      const response = await lastValueFrom(
        this.httpService.get(`${process.env.NEW_VERIFYME_URL}/v2/ng/identities/tin/${TIN}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'json',
        }),
      );
      return response.data;
    } catch (error) {
      console.log('Error in TIN verification:', error);
      throw error;
    }
  }

  // NIN Verification
  async NINVerification(NIN: string, body: any = {}) {
    const response = await lastValueFrom(
      this.httpService.post(
        `${process.env.NEW_VERIFYME_URL}/v1/verifications/identities/nin/${NIN}`,
        {
          headers: { Authorization: `Bearer ${process.env.NEW_VERIFYME_SECRET_KEY}` },
          responseType: 'json',
          json: { lastname: `${body.lastname}`, dob: '04' },
        },
      ),
    );
    return response.data;
  }

  // BVN Verification
  async BVNVerification(BVN: string, body: any = {}) {
    const response = await lastValueFrom(
      this.httpService.post(
        `${process.env.NEW_VERIFYME_URL}/v1/verifications/identities/bvn/${BVN}`,
        {
          headers: { Authorization: `Bearer ${process.env.NEW_VERIFYME_SECRET_KEY}` },
          responseType: 'json',
          json: { lastname: `${body.lastname}`, dob: '22-06-2024' },
        },
      ),
    );
    return response.data;
  }

  // Other verifications can be added here (CAC, Drivers License, etc.)
}
