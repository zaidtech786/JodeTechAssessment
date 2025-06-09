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

// All the states defined here
  users: any[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 10;
  selectedDate: string = '';
  noUsersFound = false;
  isDownloading = false;
  searchQuery: string = '';
  originalUsers: any[] = [];

  // Load users when page reload
  ngOnInit() {
    this.loadUsers(this.currentPage);
  }
  loadUsers(page: number) {
    this.currentPage = page;
    this.userService
      .getUsers(page, this.limit, this.selectedDate)
      .subscribe((data: any) => {
        this.originalUsers = data.users;
        this.users = data.users;
        this.totalPages = data.totalPages;
        this.noUsersFound = this.users.length === 0;
      });
  }

  // Displaying pages into the UI
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
    this.searchUsers();
    return pages;
  }

  // Pagination
  changePage(page: number) {
    if (page === -1 || page === this.currentPage) return;
    this.loadUsers(page);
  }

  // Filter User by Date
  filterByDate() {
    this.currentPage = 1;
    this.loadUsers(this.currentPage);
  }


  // Download Excel File Functionality
 downloadExcel() {
    if (!this.selectedDate) {
      return alert('Please enter a date to download data');
    }

    this.isDownloading = true;

    this.userService.downloadUsersExcel(this.selectedDate).subscribe({
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



  // Searching Functionality
  searchUsers() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.users = [...this.originalUsers];
      this.noUsersFound = this.users.length === 0;
      return;
    }

    this.users = this.originalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    this.noUsersFound = this.users.length === 0;
  }
}
