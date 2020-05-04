// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url :'https://localhost:44355/api',
  AppConfig: {
    clientID :'7b357602-7713-41d2-a0a3-6273c7a30b28',
    tenantID:'3c6675bc-a934-4012-9ea6-df6f9d0903cf',
    webClientId:'7b357602-7713-41d2-a0a3-6273c7a30b28',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
