import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/config';

@Injectable()
export class AdalConfigService {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
  get AdalSettings() {
    return {
      clientId: this.config.clientId,
      tenantId: this.config.tenantId,
      redirectUri: this.config.redirectUri,
      postLogoutRedirectUri: window.location.origin,
      navigateToLoginRequestUrl: true
    }
  }

}
