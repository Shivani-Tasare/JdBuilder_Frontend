import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-tags-index',
  templateUrl: './tags-index.component.html',
  styleUrls: ['./tags-index.component.scss']
})
export class TagsIndexComponent implements OnInit {
  startDate: any;
  endDate: any;
  tagList: any;
  constructor(private datePipe: DatePipe, private adminService: AdminService) { }

  ngOnInit() {
  }

  exportTagsList(){
    const sDate = this.datePipe.transform(this.startDate,"yyyy-MM-dd");
    const eDate = this.datePipe.transform(this.endDate,"yyyy-MM-dd");
    this.adminService.fetchTagsList(sDate,eDate).subscribe(result => {
      this.tagList = result['ResponseList'];
      console.log(this.tagList);
      
    })
}
}
