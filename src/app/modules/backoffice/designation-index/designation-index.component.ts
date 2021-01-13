import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
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
  value : any;
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Data>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  designationList: string[];
  searchResults: string[];
  associatedjdNo: any;
  data: any;

  constructor(private adminService: AdminService,public dialog: MatDialog,private ref: ChangeDetectorRef) {
    
  }

  ngOnInit() {
   
    this.adminService.fetchDesignationList().subscribe(response=>{
      this.designationList = response['ResponseList']
      this.dataSource = response['ResponseList']
      this.data = response['ResponseList'];
    this.dataSource.sort = this.sort;
    })
  }  

  applyFilter(filterValue: string) {
    this.adminService.searchDesignations(filterValue).subscribe(result=>{
      this.searchResults = result["ResponseList"];
    })
  }

  openDialog(action,obj) {
    this.adminService.getAssociatedDesignationsList(obj.Id).subscribe(res=>{
      this.associatedjdNo = res;
   
    obj.action = action;
    obj.count = this.associatedjdNo;
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
  })
  }

  xyz(option){
    let value = [];
    this.data.forEach(element => {
      if(option.value == element.DesignationName){
        value.push(element)
        this.data = value
        this.dataSource = this.data;
      this.table.renderRows();
    }
    });
    this.data = this.designationList
  }

  updateData(data){
    this.adminService.updateDesignations(data).subscribe(response => {
        // this.data.forEach(element => {
        //   if(element.Id == response['Response'].Id){
        //     this.data.DesignationName = response['Response'].DesignationName;
        //     this.dataSource = this.data
        //     this.table.renderRows();
        //     this.ref.detectChanges();
        //   }  
        // });
        window.location.reload()
    })
  }

  deleteData(data){
    this.adminService.deleteDesignations(data).subscribe(res => {
      if(res['StatusCode'] == 200){
        let index = this.data.findIndex((i) =>{
          return (i.Id == data.Id)
        })
        this.data.splice(index,1);
        this.table.renderRows();
      }
     })
  }
}
