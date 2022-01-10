import { Injectable } from '@angular/core';
import Shopping from 'src/app/model/shopping';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private storeService: StoreService) {}

  doesImageExist = (url: string) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });

  getUniqueId = () => {
    const stringArr = [];
    for (let i = 0; i < 2; i++) {
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  };

  addToShoppingList = (ingredients: any[]) => {
    const newShoppingList = [...this.storeService.shoppingList];
    for (let i = 0; i < ingredients.length; i++) {
      const findIndex = this.storeService.shoppingList.findIndex(
        (x: Shopping) => x.name == ingredients[i].ingredientName
      );
      if (findIndex >= 0) {
        newShoppingList[findIndex] = {
          ...newShoppingList[findIndex],
          quantity:
            newShoppingList[findIndex].quantity +
            Number(ingredients[i].ingredientQuantity),
        };
      } else {
        newShoppingList.push({
          name: ingredients[i].ingredientName,
          quantity: Number(ingredients[i].ingredientQuantity),
        });
      }
    }
    this.storeService.onChangeShopping(newShoppingList);
  };
}
