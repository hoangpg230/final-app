import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StoreService } from '../core/services/store.service';
import { UtilityService } from '../core/services/utility.service';
import Recipe from '../model/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  constructor(private router: Router, 
    private storeService: StoreService,
    private utilityService: UtilityService) {
    this.storeService.recipesSubject.subscribe((recipe: Recipe[]) => {
      this.recipes = recipe;
    });
  }

  isShowTitles: boolean =
    this.router.url.split('/').length <= 2 &&
    this.router.url.split('/')[1].includes('recipes');

  recipes: Recipe[] = this.storeService.recipes;
  recipe!: Recipe | any;
  recipeActive: string = '';

  addRecipeLink(type: string) {
    this.isShowTitles = false;
    switch (type) {
      case 'add':
        this.recipeActive = '';
        this.router.navigate(['/recipes/add']);
        break;
      case 'edit':
        this.router.navigate(['/recipes/edit/' + this.recipeActive]);
        break;
    }
  }

  addToShopping(id: string) {
    const recipe = this.recipes.find((recipe: Recipe) => recipe.id === id);
    if (recipe) {
      this.utilityService.addToShoppingList(recipe.ingredients)
    }
  }

  showDetailRecipe(id: string) {
    this.isShowTitles = true;
    this.router.navigate(['/recipes']);
    this.recipeActive = id;
    const recipe = this.recipes.find((recipe: Recipe) => recipe.id === id);
    if (recipe) {
      this.recipe = recipe;
    }
  }

  deleteRecipe(id: string) {
    this.recipes.splice(
      this.recipes.findIndex((recipe: Recipe) => recipe.id == id),
      1
    );
    this.storeService.onChangeRecipe(this.recipes);
    this.recipe = null;
  }
  ngOnInit(): void {}
}
