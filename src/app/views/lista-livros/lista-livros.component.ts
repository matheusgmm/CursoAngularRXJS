import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, count, debounceTime, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  // listaLivros: Livro[];
  // subscription: Subscription;
  // livro: Livro;
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo Inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => { 
      console.log(erro)
      return of()
    }) 
  )

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo Inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap((retornoAPI) => console.log(retornoAPI)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // this.mensagemErro = 'Ops, ocorreu um erro, recarregue a aplicação.'
      // return EMPTY
      console.log(erro)
      return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro, recarregue a aplicação.'))
    })
    
  );
  

  // this.livrosEncontrados$.pipe(count()).subscribe((total) => {
  //   this.totalLivros = total;
  // });

  

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }

    // buscarLivros() {
    //   this.subscription = this.service.buscar(this.campoBusca).subscribe({
    //     next: items => {
    //       console.log('Requisições ao servidor')
    //       this.listaLivros = this.livrosResultadoParaLivros(items)
    //     },
    //     error: erro => console.error(erro)
    //     // complete: () => console.log('Observable completado')
    //   }
    //   )
    // }

    // const livros: Livro[] = []

    // items.forEach((item) => {
    //   livros.push (this.livro = {
    //     title: item.volumeInfo?.title,
    //     authors: item.volumeInfo?.authors,
    //     publisher: item.volumeInfo?.publisher,
    //     publishedDate: item.volumeInfo?.publishedDate,
    //     description: item.volumeInfo?.description,
    //     previewLink: item.volumeInfo?.previewLink,
    //     thumbnail: item.volumeInfo?.imageLinks?.thumbnail
    //   })
    // })

    // return livros;

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}



