import { Component, OnInit } from '@angular/core';
import {Field} from '../../shared/field';
import {Prediction} from '../../shared/prediction';
import { OfferService } from '../../services/offer.service';
import { FieldService } from '../../services/field.service';
import { UserOfferService } from '../../services/user-offer.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthentificationService} from '../../services/authentification.service';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit {

  public offers: any;
  public fields: any;
  public allFields: any;
  public selectedOffer: any;
  public selectedField: string;
  public modifyingPrediction: boolean;
  public displayResults: boolean;

  private modalDanger: NgbModalRef;
  private modalWarning: NgbModalRef;

  public load = true;

  constructor(
    private _authentificationService: AuthentificationService,
    private modalService: NgbModal,
    private _offerService: OfferService,
    private _fieldService: FieldService,
    private _userofferService: UserOfferService
  ) { }

  ngOnInit() {
    this._authentificationService.connectedUser$.subscribe(item => {
      this.load = true;
      if(item==undefined){
          this._userofferService.setCurrentOffersList(undefined);
          this._userofferService.setSelectedOffer(undefined);
          this._userofferService.setAssociatedField(undefined);
      }
      else{
        this.load = false;
      }
    });

    // subscribe and get saved data
    this.displayResults = !!this.selectedOffer;

    this._fieldService.getAllFieldsName().subscribe(
      res => {
        this.allFields = res;
      }
    )

    let list = this._userofferService.getCurrentOffersList();
    if (list) {
      this.load = false;
      this.offers = list;
    } else {
      this._offerService.getOfferForConnectedClient().subscribe(
          data => {
            this.offers = data;
            this._userofferService.setCurrentOffersList(this.offers);
            this.load = false;
          },
          error => {}
      );
    }
    this.modifyingPrediction = false;
    this.selectedField = '';
  }

  // Select an offer and get the associated field
  selectOffer(o): void {
    this.clear();
    // fields
    this.selectedOffer = o;
    this._userofferService.setSelectedOffer(this.selectedOffer);
    this.displayResults = true;
    this._fieldService.getFieldByOffer(this.selectedOffer.id)
    .subscribe(
      data => {
        this.selectedOffer.inbase = data[0].inbase;
        this.fields = data;
        this._userofferService.setAssociatedField(this.fields);
      },
      error => {console.log(error); this.fields = [];}
    );
  }

  // Allow user to modify the field
  modifyPrediction() {
    this.modifyingPrediction = true;
    this.selectedField = this.fields[0].name;
  }

  // Add prediction in learning base
  validatePrediction() {
    this._offerService.putOfferInBase(this.selectedOffer.id).subscribe(
      res => this.selectedOffer.inbase = true
    );
  }

  saveField() {
    function isSelectedField(f) {
      return f.name === this.selectedField;
    }

    if (this.selectedField !== '') {
      const field = this.allFields.find(isSelectedField, this);
      this._offerService.updatePredictionOfOffer(this.selectedOffer.id, field.id).subscribe(
        res => {
          this.fields = [field];
          this._userofferService.setAssociatedField(this.fields);
        }, error2 => {}
      );
      this.modifyingPrediction = false;
    }
  }

  clear() {
    this.modifyingPrediction = false;
  }

  //
  deleteOffer(offer){
    if (this.selectedOffer && offer.id === this.selectedOffer.id){
      this._userofferService.setSelectedOffer(undefined);
      this._userofferService.setAssociatedField([]);
      this.selectedOffer = undefined;
      this.fields = undefined;
    }
    console.log(offer);
    this._offerService.deleteOffer(offer.id).subscribe(
      data => {
        var index = this.offers.findIndex(it => it.id === offer.id);
        this.offers.splice(index, 1);
      },
      error => {}
    );
  }

  openDangerPopUp(danger, offer) {
    this.modalDanger = this.modalService.open(danger);
    this.modalDanger.result.then(
      (result) => {
        if(result=="yes"){
          this.deleteOffer(offer);
        }
      },
      (reason) => {console.log('');}
    );

  }

  openWarningPopUp(warning) {
    this.modalWarning = this.modalService.open(warning);
    this.modalWarning.result.then(
      (result) => {
        if(result=="yes"){
          this.validatePrediction()
        }
      },
      (reason) => {console.log('');}
    );

  }

}
