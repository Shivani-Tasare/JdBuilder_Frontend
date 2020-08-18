import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  debugger;
  handleError(error: any): void {
   const chunkFailedMessage = /Loading chunk [\d]+ failed/;
   debugger;
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }
  }
}