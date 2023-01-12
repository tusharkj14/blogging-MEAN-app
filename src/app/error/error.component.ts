import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  // message = 'An Unknown Error Occured';
  constructor(@Inject(MAT_DIALOG_DATA) public data : {message : string}, public dialog : MatDialogRef<any>){}
  onClick(){
    this.dialog.close();
  }
}
