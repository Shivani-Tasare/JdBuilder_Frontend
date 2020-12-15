import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

export interface Data {
  Id: string;
  DesignationName: string;
}

@Component({
  selector: 'app-designation-index',
  templateUrl: './designation-index.component.html',
  styleUrls: ['./designation-index.component.scss']
})

export class DesignationIndexComponent implements OnInit {

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
   
    this.adminService.fetchDesignationList().subscribe(response=>{
      this.designationList = response['ResponseList']
      console.log(this.designationList)
      this.dataSource = response['ResponseList'];

      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
  }  

  applyFilter(filterValue: string) {
    console.log(filterValue)
    this.adminService.searchDesignations(filterValue).subscribe(result=>{
      console.log(result);
      this.searchResults = result["ResponseList"];
    })
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '250px',
      data:obj

    });
    dialogRef.afterClosed().subscribe(result => {
       if(result.event == 'Update'){
        this.updateData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteData(result.data);
      }
    });
  }

  updateData(data){
    this.adminService.updateDesignations(data).subscribe(response => {
      console.log(response);
      window.location.reload();
      this.associatedEntities(data.Id)
    })
  }

  deleteData(data){
    this.adminService.deleteDesignations(data).subscribe(res => {
      console.log(res);
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

