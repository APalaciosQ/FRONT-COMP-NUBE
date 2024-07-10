import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

  constructor(fb: FormBuilder, 
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this.form = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'))
  }

  ngOnInit(): void{
    //Es editar
    if(this.id != 0){
      this.operacion = 'Editar ';
      this.getProduct(this.id);
    }
  }

  addProduct() {
    const product: Product = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      stock: this.form.value.stock,
    };

    this.loading = true;
    if(this.id !== 0){
      //Es editar
      product.id = this.id;
      this._productService.updateProduct(this.id, product).subscribe(() =>{
        this.loading = false;
        this.toastr.info('Producto modificado con exito','Producto modificado');
        this.router.navigate(['/']);
      });
    }else{
      //Es agregar
      this._productService.saveProduct(product).subscribe(() => {
      this.loading = false;
      this.toastr.success('Producto agregado con exito','Producto agregado');
      this.router.navigate(['/']);
    });
    }

    
  }

  getProduct(id: number){
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) =>{
      this.loading = false;
      this.form.setValue({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock
      })
    });
  }  
}