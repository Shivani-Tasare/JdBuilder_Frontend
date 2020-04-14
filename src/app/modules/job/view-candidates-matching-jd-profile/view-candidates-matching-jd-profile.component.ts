import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
import Chart from 'chart.js';

@Component({
  selector: 'app-view-candidates-matching-jd-profile',
  templateUrl: './view-candidates-matching-jd-profile.component.html',
  styleUrls: ['./view-candidates-matching-jd-profile.component.scss']
})
export class ViewCandidatesMatchingJdProfileComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ViewCandidatesMatchingJdProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatchingConsultants) { }
    
   
  ngOnInit() {
   
  }

 }
