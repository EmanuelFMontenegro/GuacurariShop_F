import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showError(message: string, title = 'Error') {
    this.toastr.error(message, title);
  }

  showSuccess(message: string, title = 'Éxito') {
    this.toastr.success(message, title);
  }

  showInfo(message: string, title = 'Info') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title = 'Atención') {
    this.toastr.warning(message, title);
  }
}
