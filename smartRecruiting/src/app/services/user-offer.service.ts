import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserOfferService {

  private currentOffersList = new BehaviorSubject<any>(undefined);
  private selectedOffer = new BehaviorSubject<any>(undefined);
  private associatedField = new BehaviorSubject<any>(undefined);

  constructor() { }

  //Getter - setter
  getCurrentOffersList(): any{return this.currentOffersList.value;}
  setCurrentOffersList(newValue): void {this.currentOffersList.next(newValue);}

  getSelectedOffer(): any{return this.selectedOffer.value;}
  setSelectedOffer(newValue): void {this.selectedOffer.next(newValue);}

  getAssociatedField(): any{return this.associatedField.value;}
  setAssociatedField(newValue): void {this.associatedField.next(newValue);}

}
