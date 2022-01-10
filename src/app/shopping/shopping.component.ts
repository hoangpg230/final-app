import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../core/services/store.service';
import Shopping from '../model/shopping';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  constructor(private fb: FormBuilder, private storeService: StoreService) {
    this.storeService.shoppingListSubject.subscribe((res: Shopping[]) => {
      this.shoppingList = res;
    });
  }

  shoppingList: Shopping[] = this.storeService.shoppingList;
  isShowGroupBtn: boolean = true;

  shoppingItem!: Shopping;

  form = this.fb.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
  });

  get name() {
    return this.form.get('name');
  }
  get quantity() {
    return this.form.get('quantity');
  }

  handleSubmit() {
    if (this.form.valid) {
    }
  }

  showDetailItem(name: string) {
    const item = this.storeService.shoppingList.find(
      (x: Shopping) => x.name == name
    );
    if (item) {
      this.isShowGroupBtn = false;
      this.shoppingItem = item;

      this.form = this.fb.group({
        name: [item.name, Validators.required],
        quantity: [
          item.quantity,
          [Validators.required, Validators.pattern('[1-9][0-9]*')],
        ],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        quantity: [
          '',
          [Validators.required, Validators.pattern('[1-9][0-9]*')],
        ],
      });
    }
  }

  handleUpdate() {
    const newShoppingList = this.storeService.shoppingList.map(
      (x: Shopping) => {
        if (x.name == this.shoppingItem.name) {
          return { ...x, ...this.form.value };
        }
        return x;
      }
    );
    this.storeService.onChangeShopping(newShoppingList);
  }

  handleDelete() {
    const foundIndex = this.storeService.shoppingList.findIndex(
      (x: Shopping) => x.name == this.shoppingItem.name
    );
    const newShoppingList = [...this.storeService.shoppingList];
    if (foundIndex >= 0) {
      newShoppingList.splice(foundIndex, 1);
    }
    this.storeService.onChangeShopping(newShoppingList);
    this.showDetailItem('');
  }

  handleClear() {
    const foundIndex = this.storeService.shoppingList.findIndex(
      (x: Shopping) => x.name == this.shoppingItem.name
    );
    const newShoppingList = [...this.storeService.shoppingList];
    if (foundIndex >= 0) {
      newShoppingList[foundIndex].quantity = 0;
    }
    this.storeService.onChangeShopping(newShoppingList);
    this.showDetailItem(newShoppingList[foundIndex].name);
  }
  ngOnInit(): void {}
}
