import { Component, OnInit } from '@angular/core';
import { MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
import { Label } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { SmartServiceService } from 'src/app/services/smart-service.service';

@Component({
  selector: 'app-view-candidates-pie-chart',
  templateUrl: './view-candidates-pie-chart.component.html',
  styleUrls: ['./view-candidates-pie-chart.component.scss']
})
export class ViewCandidatesPieChartComponent implements OnInit {

  candidateRecordsAsPerSection;
  candidatesCount: number[];
  matchingConsultants: MatchingConsultants[];
  //[['90-100% '], ['80-90% '], ['70-80 %'], ['<70 %']];
  candidateCountList = [
    { id: 0, range: '90 to 100', count: 0 , candidateDetail: [], label: '90-100% '},
    { id: 1, range: '80 to 90', count: 0 , candidateDetail: [], label: '80-90% '},
    { id: 2, range: '70 to 80', count: 0, candidateDetail: [] , label: '70-80 %'},
    { id: 3, range: '< 70', count: 0, candidateDetail: [], label: '<70 %' }
  ]
  mandatoryTagsList = [];
  tagName:  string[]=[];
  desiredTagsList = [];
  constructor(private smartService : SmartServiceService) { }

  ngOnInit() {
  }

  onChartClick(event) {
    if(!!event.active.length) {

    const candidateRecords = this.candidateCountList.filter( (r) => {
      return r.label == event.active[0]._model.label;
    });
    this.candidateRecordsAsPerSection = (candidateRecords.length > 0) 
      ? candidateRecords[0].candidateDetail : [];
    }

    }
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
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
  public pieChartLabels: Label[] = [['90-100% '], ['80-90% '], ['70-80 %'], ['<70 %']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#264d00', '#66cc00', '#b3ff66', '#ffa600'],
    },
  ];


  viewCandidates(myModal: any) {
    const tags = this.mandatoryTagsList.concat(this.desiredTagsList);
    this.tagName = tags.map((res)=>res.TagName);
    if(tags.length > 0){
      this.smartService.fetchCandidatesDetails(this.tagName).subscribe(
        response => {
          this.matchingConsultants = response;
          this.candidateRecordsAsPerSection = this.matchingConsultants["MatchingConsultants"]
          this.filterCandidatesByMatchScore(this.matchingConsultants["MatchingConsultants"]);
        })
    }
  }

  filterCandidatesByMatchScore(matchingConsultants: any[]) {
     
    this.candidateCountList[0].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 90);
    this.candidateCountList[1].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 80 && x.RelevancePercentage <= 90);
    this.candidateCountList[2].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage >= 70 && x.RelevancePercentage <= 80);
    this.candidateCountList[3].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage < 70);
    this.candidateCountList[0].count = this.candidateCountList[0].candidateDetail.length;
    this.candidateCountList[1].count = this.candidateCountList[1].candidateDetail.length;
    this.candidateCountList[2].count = this.candidateCountList[2].candidateDetail.length;
    this.candidateCountList[3].count = this.candidateCountList[3].candidateDetail.length;
    this.pieChartData = this.candidateCountList.map(x => x.count);

  }

}
