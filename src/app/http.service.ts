import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { APIResponse, Game } from './models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}
  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let httpParams: HttpParams = new HttpParams().set('ordering', ordering);
    if (search) {
      httpParams = httpParams.set('search', search).set('ordering', ordering);
    }
    return this.httpClient.get<APIResponse<Game>>(`${env.apiUrl}/api/games`, {
      params: httpParams,
    });
  }
  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.httpClient.get<Game>(
      `${env.apiUrl}/api/games/${id}`
    );
    const gameTrailersRequest = this.httpClient.get(
      `${env.apiUrl}/api/games/${id}/movies`
    );
    const gameScreenshotsRequest = this.httpClient.get(
      `${env.apiUrl}/api/games/${id}/screenshots`
    );

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        };
      })
    );
  }
}
