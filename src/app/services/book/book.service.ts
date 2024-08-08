import { Injectable } from '@angular/core';
import { constant } from '../../conf/constant'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../models/book/book.model' 


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = constant.apiUrl;

  constructor(private http: HttpClient) { }

    // Méthode pour obtenir la liste de tous les livres
    getAllBooks(): Observable<Book[]> {
      return this.http.get<Book[]>(`${this.apiUrl}/books`);
    } 
}
