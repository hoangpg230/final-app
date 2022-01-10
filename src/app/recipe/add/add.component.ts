import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import Recipe from 'src/app/model/recipe';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) {
  }
  
  isExistImage: boolean = false;
  recipe!: Recipe;
  onChangeImage(image: string) {
    this.utilityService
      .doesImageExist(image)
      .then((res: any) => {
        this.isExistImage = res;
      })
      .catch((res) => {
        this.isExistImage = res;
      });
  }

  form = this.fb.group({
    name: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required],
    ingredients: this.fb.array([]),
  });
  get name() {
    return this.form.get('name');
  }
  get image() {
    return this.form.get('image');
  }
  get description() {
    return this.form.get('description');
  }
  get ingredients() {
    return this.form.controls['ingredients'] as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      ingredientName: ['', Validators.required],
      ingredientQuantity: [
        '1',
        [Validators.required, Validators.pattern('[1-9][0-9]*')],
      ],
    });
    this.ingredients.push(ingredientForm);
  }

  deleteIngredient(ingredientIndex: number) {
    this.ingredients.removeAt(ingredientIndex);
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  handleSubmit() {
    if (this.form.valid) {
      if (this.route.snapshot.paramMap.get('id')) {
        let data = {
          id: this.route.snapshot.paramMap.get('id'),
          ...this.form.value,
        };
        const recipes = this.storeService.recipes.map((recipe) => {
          if (recipe.id == this.route.snapshot.paramMap.get('id')) {
            return (recipe = { ...recipe, ...data });
          }
          return recipe;
        });
        this.storeService.onChangeRecipe(recipes);
      } else {
        const data = {
          id: this.utilityService.getUniqueId(),
          ...this.form.value,
        };
        const recipes = [...this.storeService.recipes]
        recipes.push(data)
        this.storeService.onChangeRecipe(recipes);
      }
      this.goBack();
    } else {
      alert('Vui lòng nhập hợp lệ các trường!');
    }
  }
  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      const recipe = this.storeService.recipes.find(
        (recipes) => recipes.id == this.route.snapshot.paramMap.get('id')
      );
      if (recipe) {
        this.onChangeImage(recipe.image);
        this.recipe = recipe;
        this.form = this.fb.group({
          name: [this.recipe?.name || '', Validators.required],
          image: [this.recipe?.image || '', Validators.required],
          description: [this.recipe?.description || '', Validators.required],
          ingredients: this.fb.array([]),
        });
        for (let i = 0; i < this.recipe.ingredients.length; i++) {
          const ingredientForm = this.fb.group({
            ingredientName: [this.recipe.ingredients[i].ingredientName],
            ingredientQuantity: [this.recipe.ingredients[i].ingredientQuantity],
          });
          this.ingredients.push(ingredientForm);
        }
      }
    }
  }
}
