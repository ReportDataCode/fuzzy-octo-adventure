import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { APIResponse, Game } from '../models';
import { Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public sort: string;
  public games: Array<Game> | null = null;

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sort = '-released';
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }
  searchGames(sort: string, search?: string): void {
    this.httpService
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        console.log(gameList);
      });
  }
}
