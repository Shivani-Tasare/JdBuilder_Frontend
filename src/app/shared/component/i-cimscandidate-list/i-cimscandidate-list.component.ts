import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-i-cimscandidate-list',
  templateUrl: './i-cimscandidate-list.component.html',
  styleUrls: ['./i-cimscandidate-list.component.scss']
})
export class ICIMSCandidateListComponent implements OnInit, OnChanges {
  //@Input() data = [];
  @Input() data = {TotalCount: "0", CandidateList: [], ExactMatch:null, PartialMatch: null};
  constructor(private router: Router) { }

  public pieChartLabels:string[] = ['Exact Match', 'Partial Match'];
  public pieChartData:number[] = [0, 0];
  public pieChartType:string = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['#264d00', '#ffa600'],
    },
  ];
  //events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  get showChart() {
    return !!this.data['TotalCount'] && !!this.data['TotalCount'].split('+')[0];
  }
  ngOnInit() {
  }
  ngOnChanges() {
    if(!!this.data) {
      this.data.CandidateList = 
      !!(!!this.data['ExactMatch'] && !!this.data['ExactMatch'].Total)? 
      this.data['ExactMatch'].CandidateList:
      (!!this.data['PartialMatch'] && !!this.data['PartialMatch'].Total ? this.data['PartialMatch'].CandidateList : []);
      
      this.pieChartData =[
      !!this.data['ExactMatch'] ? this.data['ExactMatch'].Total : 0,
      !!this.data['PartialMatch'] ? this.data['PartialMatch'].Total: 0
    ];
    }
  }
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      onClick: null
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  getAddress(address) {
    if(!!address) {
      // return  address[0].map((r)=> {
      //   let location = '';
      //   if(!!r.AddressCountry) {
      //     location += r.AddressCountry.Value;
      //   }
      //   if(!!r.AddressCity) {
      //     location +=', '+ r.AddressCity;
      //   }
      //   if(!!r.AddressState) {
      //     location += ', ' + r.AddressState.Value;
      //   }
      //   return location;        
      //   });
      //return `${address[0].AddressCountry.Value} - ${address[0].AddressCity}, ${address[0].AddressState.Value}`;
        let location = '';
        if(!!address[0].AddressCountry) {
          location += address[0].AddressCountry.Value;
        }
        if(!!address[0].AddressCity) {
          location +=' - '+ address[0].AddressCity;
        }
        if(!!address[0].AddressState) {
          location += ', ' + address[0].AddressState.Value;
        }
        return location;        
    }
    return '';
  }
getLocation(address) {
    if(!!address) {
      return  address.map((r)=> {
        let location = '';
        if(!!r.AddressCity) {
          location = r.AddressCity;
        }
        if(!!r.AddressState) {
          location += ', ' + r.AddressState.Value;
        }
        return location;
       // return [];        
        }).join(' | ')
    }

return '';
  }


getPhoneNumber(phone) {
    if(!!phone) {
      return  phone.map((r)=> {
        if(!!r.PhoneNumber) {
          return (r.PhoneNumber);
        }
        return [];        
        }).join(', ')
    }

return '';
  }

  viewResume(email: String){
    window.open("//" + `'/view-resume/${email}'`, '_blank');
  }
}
