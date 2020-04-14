import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobId'
})
export class JobIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let bareNum = value + '';
    let zeroString = "0000";
    return "DMIJD"+zeroString.substring(bareNum.length, 14) + bareNum
  }

}
