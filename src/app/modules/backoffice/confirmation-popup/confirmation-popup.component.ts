import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/services/admin.service';


export interface Data {
  Id: string;
  Name: string;
}

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  action:string;
  local_data:any;
  count: any;
  entity: any;
  constructor(public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Data, private adminService: AdminService) {
      this.local_data = {...data};  
      this.action = this.local_data.action;
      this.count = this.local_data.count
      
   }
   formControl = new FormControl("");
  ngOnInit() {
    const data = Object.keys(this.local_data);
    data.indexOf('DesignationName') > 0 ? this.entity = this.local_data.DesignationName :
    this.entity = this.local_data.ExperienceName;
  }

  updateData(event){
    if((location.pathname).includes('backoffice/experience')){
      this.local_data.ExperienceName = event;
    }else{ this.local_data.DesignationName = event }
  }


  addData(value){
    this.local_data.ExperienceName = value;
  }
  doAction(){
    console.log(this.local_data,this.action)
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}
