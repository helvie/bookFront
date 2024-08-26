import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book/book.service';
import { Book } from '../../models/book/book.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books!: Book[];

  // constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // this.bookService.getAllBooks().subscribe(data => {
    //   this.books = data;
    //   console.log(this.books);  
    // });
  }
}
