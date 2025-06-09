import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class UserComponent {
  constructor(private http: HttpClient, private userService: UserService) {}

  users: any[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 20;
  selectedDate: string = '';
  noUsersFound = false;
  isDownloading = false;

  ngOnInit() {
    this.loadUsers(this.currentPage);
  }
  loadUsers(page: number) {
    this.currentPage = page;
    this.userService
      .getUsers(page, this.limit, this.selectedDate)
      .subscribe((data: any) => {
        this.users = data.users;
        this.totalPages = data.totalPages;
        this.noUsersFound = this.users.length === 0;
      });
  }

  get pages(): number[] {
    const pages: number[] = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(this.currentPage - 1, 2);
      let endPage = Math.min(this.currentPage + 1, this.totalPages - 1);

      if (startPage > 2) {
        pages.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push(-1);
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  changePage(page: number) {
    if (page === -1 || page === this.currentPage) return;
    this.loadUsers(page);
  }

  filterByDate() {
    this.currentPage = 1;
    this.loadUsers(this.currentPage);
  }

  downloadExcel() {
    if (!this.selectedDate) {
      return alert('Please enter a date to download data');
    }
    this.isDownloading = true;
    const url = `/user/download-users${
      this.selectedDate ? '?date=' + this.selectedDate : ''
    }`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = fileURL;
        anchor.download = 'users.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(fileURL);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Download failed', err);
        alert('Something went wrong during the download.');
        this.isDownloading = false;
      },
    });
  }
}
