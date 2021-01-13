import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
export interface Data{
  Id : string ;
  ExperienceName : string;
}
@Component({
  selector: 'app-experience-index',
  templateUrl: './experience-index.component.html',
  styleUrls: ['./experience-index.component.scss']
})
export class ExperienceIndexComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: any = [];
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  designationList: string[];
  searchResults: string[];
  associatedjdNo: any;
  data: any;
  constructor(private adminService: AdminService,public dialog: MatDialog) {
    
  }

  ngOnInit() {
   
    this.adminService.fetchExperienceList().subscribe(response=>{
      this.designationList = response['ResponseList']
      this.dataSource = response['ResponseList'];
      this.data = response['ResponseList'];
    })
  }  

  openDialog(action,obj?) {
    if(action == 'Add'){
      obj = {Id: 0, ExperienceName: " ", action: "Add", count: 0}
     const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '250px',
        data:obj
      });dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          this.addColumn(result.data);} })
    }else{
      this.adminService.getAssociatedExperienceCount(obj.Id).subscribe(res => {
        obj.action = action;
        obj.count = res;
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
          width: '250px',
          data:obj
          
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result.event == 'Update'){
            this.updateData(result.data);
          }
        });
      })
    }
  }

  addColumn(data){
    this.adminService.addExperience(data).subscribe(response =>{
      console.log(response);
      this.dataSource.push(response['Response']);
      this.table.renderRows();
    })
   }

  updateData(data){
    this.adminService.updateExperiences(data).subscribe(response => {
      
      window.location.reload();
    })
  }
}

