import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agregar-item-dialog',
  imports:[CommonModule,FormsModule],
  templateUrl: './agregar-item-dialog.component.html',
  styleUrls: ['./agregar-item-dialog.component.css']
})
export class AgregarItemDialogComponent {
  item = { nombre: '', descripcion: '', precio: 0, stock: 0 };

  constructor(public dialogRef: MatDialogRef<AgregarItemDialogComponent>) {}

  agregarItem() {
    // Cierra el diálogo y pasa los datos del item
    this.dialogRef.close(this.item);
  }
}
