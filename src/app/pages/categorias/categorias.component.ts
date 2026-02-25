import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from '../../models/categorias/category-reponse.interface';
import { StoreService } from '../../services/store.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias',
  imports: [],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

   categories: CategoryResponse[] = [];

   constructor(private storeService: StoreService) { }

    async ngOnInit(): Promise<void> {
   
        try {
             this.categories = await firstValueFrom(this.storeService.getCategories());
             console.log('Categorias:', this.categories);
        } catch (error) {
             console.error('Erro ao carregar categorias:', error);
        }
   
   }

}
