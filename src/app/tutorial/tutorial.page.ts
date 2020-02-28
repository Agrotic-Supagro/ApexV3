import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }


  closeTuto() {
    this.router.navigateByUrl('/home');
  }

}
