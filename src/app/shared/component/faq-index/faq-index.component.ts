import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-faq-index',
  templateUrl: './faq-index.component.html',
  styleUrls: ['./faq-index.component.scss']
})
export class FAQIndexComponent implements OnInit {
  panelOpenState = false;
  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 140 ||
      document.documentElement.scrollTop > 140) && document.getElementById('header')) {
      document.getElementById('header').classList.add('fixed-header');
    }
    if (document.documentElement.scrollTop < 1 && document.getElementById('header')) {
      document.getElementById('header').classList.remove('fixed-header');
    }
  }

}
