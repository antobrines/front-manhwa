import { Component, ElementRef, ViewChild } from '@angular/core';
import { ManhwaService } from '../services/manhwa.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manhwa',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './manhwa.component.html',
  styleUrl: './manhwa.component.css'
})
export class ManhwaComponent {
  public anime: any = {};
  public idAnime: any = 0;
  public saisons: any[] = [];
  public episodesView: any[] = [];
  public userLists: any[] = [];
  public myAnimeIdSeeList: number[] = [];
  public comments: any[] = [];
  public username: string = '';
  @ViewChild('episodesBtn') episodesBtn: ElementRef | undefined;

  constructor(
    private manhwaS: ManhwaService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.idAnime = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    this.manhwaS.getManhwaById(this.idAnime).subscribe((res: any) => {
      this.anime = res.body;
    });
  }

  changeDate(date: Date): any {
    return this.datePipe.transform(date, 'yyyy');
  }

  async changeStateViewEpisode(event: any, idEpisode: number) {
    
  }
}
