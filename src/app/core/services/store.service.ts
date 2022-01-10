import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Recipe from 'src/app/model/recipe';
import Shopping from 'src/app/model/shopping';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  recipes: Recipe[] = [];
  recipesSubject: Subject<Recipe[]> = new Subject<Recipe[]>();

  shoppingList: Shopping[] = [];
  shoppingListSubject: Subject<Shopping[]> = new Subject<Shopping[]>();

  constructor() {
    this.recipesSubject.subscribe((recipes) => {
      this.recipes = recipes;
    });

    this.shoppingListSubject.subscribe((shoppingList) => {
      this.shoppingList = shoppingList;
    });
  }

  onChangeRecipe(recipes: Recipe[]) {
    this.recipesSubject.next(recipes);
  }

  onChangeShopping(shoppingList: Shopping[]) {
    this.shoppingListSubject.next(shoppingList);
  }
}
