import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  dataSource: MatTableDataSource<Data>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  designationList: string[];
  searchResults: string[];
  associatedjdNo: any;

  constructor(private adminService: AdminService,public dialog: MatDialog) {
    
  }

  ngOnInit() {
   
    this.adminService.fetchExperienceList().subscribe(response=>{
      this.designationList = response['ResponseList']
      console.log(this.designationList)
      this.dataSource = response['ResponseList'];

      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
  }  

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '250px',
      data:obj
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addColumn();
      }else if(result.event == 'Update'){
        this.updateData(result.data);
      }
    });
  }


  addColumn(){ }

  updateData(data){
    this.adminService.updateExperiences(data).subscribe(response => {
      console.log(response);
      window.location.reload();
      this.associatedEntities(data.Id)
    })
  }

  associatedEntities(id){
    this.adminService.getAssociatedDesignationsList(id).subscribe(res=>{
      this.associatedjdNo = res;
    })
  }
}

