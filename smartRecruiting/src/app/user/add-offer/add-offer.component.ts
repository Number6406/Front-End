import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {

  TestFormations = [
    { id: 1, name: 'Cras justo odio' },
    { id: 2, name: 'Dapibus ac facilisis in' },
    { id: 3, name: 'Morbi leo risus' },
  ];
  formations = [];
  displayResults=false;
  offre = "";

  searchFormation(): void {
    this.displayResults = true;
    this.formations= this.TestFormations;
    this.router.navigate(['/offre/1']);
  }

  reload():void{
    this.offre = ""
    this.displayResults = false;
  }
  constructor(public router: Router) {
  }

  ngOnInit() {
  }

}