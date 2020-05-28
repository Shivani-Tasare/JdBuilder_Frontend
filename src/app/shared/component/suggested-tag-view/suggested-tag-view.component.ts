import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-suggested-tag-view',
  templateUrl: './suggested-tag-view.component.html',
  styleUrls: ['./suggested-tag-view.component.scss']
})
export class SuggestedTagViewComponent implements OnInit {
  @Input() associatedTags = [];
  @Input() label ='';
  @Output() onTagEmitt = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  appendToTags(index) {
    this.onTagEmitt.emit(index);
  }

}
