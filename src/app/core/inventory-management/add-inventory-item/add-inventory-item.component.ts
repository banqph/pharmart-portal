import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from 'src/app/shared/interfaces/item';
import { AddItemRequest } from 'src/app/shared/interfaces/requests/itemRequest';
import { ItemManagementService } from 'src/app/shared/services/item-management/item-management.service';
import { AddInventoryItemSnackComponent } from './add-inventory-item-snack/add-inventory-item-snack.component';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['./add-inventory-item.component.css']
})
export class AddInventoryItemComponent {

  item?: Item;
  itemRequest: AddItemRequest;
  imageName: string = "no file chosen";

  constructor(private itemManagementService: ItemManagementService,
    private _snackBar: MatSnackBar) {
    this.itemRequest = this.initItem();
  }

  initItem() {
    const emptyBlob = new Blob([], { type: 'application/octet-stream' });
    const emptyFile = new File([emptyBlob], 'empty.txt', { type: 'text/plain' });
    return {
      name: '',
      description: '',
      price: 0,
      image: emptyFile,
      stock: 0,
      commission: 0
    };
  }

  addItem() {
    const formData = new FormData();
    formData.append('name', this.itemRequest.name);
    formData.append('description', this.itemRequest.description);
    formData.append('price', this.itemRequest.price.toString());
    formData.append('stock', this.itemRequest.stock.toString());
    formData.append('image', this.itemRequest.image);
    formData.append('commission', this.itemRequest.commission.toString());
    this.itemManagementService.postData(formData);

    this._snackBar.openFromComponent(AddInventoryItemSnackComponent, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }

  handleDroppedFiles(files: FileList) {
    if (files.length > 0) {
      this.imageName = files[0].name;
      this.itemRequest.image = files[0];
    }
  }

  @HostListener("dragover", ["$event"])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  @HostListener("dragleave", ["$event"])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.handleDroppedFiles(files);
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.handleDroppedFiles(files);
  }
}

