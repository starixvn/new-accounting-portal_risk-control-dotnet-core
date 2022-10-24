import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterService } from './filter.service';
import { GameGroup, GameType, JackpotType, FilterModel, SearchType } from './filter.model';

@Component({
  selector: 'nap-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [
    FilterService
  ]
})
export class FilterComponent implements OnInit {
  @Output() generate = new EventEmitter<FilterModel>();
  gameGroupId = 0;
  gameGroups: GameGroup[];
  gameTypeId = 0;
  gameTypes: GameType[];
  jackpotTypeId = 0;
  jackpotTypes: JackpotType[];

  constructor(
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.filterService.getGameGroups().subscribe(gameGroups => this.gameGroups = gameGroups);
    this.onGameGroupChange();
    this.onGameTypeChange();
  }

  onGameGroupChange() {
    this.gameTypeId = 0;
    this.jackpotTypeId = 0;
    this.filterService.getGameTypes(this.gameGroupId).subscribe(gameTypes => this.gameTypes = gameTypes);
  }

  onGameTypeChange() {
    this.jackpotTypeId = 0;
    this.filterService.getJackpotTypes(this.gameGroupId, this.gameTypeId).subscribe(jackpotTypes => this.jackpotTypes = jackpotTypes);
  }

  search() {
    const filterModel: FilterModel = {
      gameGroupId: this.gameGroupId,
      gameTypeId: this.gameTypeId,
      jackpotTypeId: this.jackpotTypeId,
      searchType: SearchType.RealTime
    };
    this.generate.emit(filterModel);
  }

  searchWinRecord() {
    const filterModel: FilterModel = {
      gameGroupId: this.gameGroupId,
      gameTypeId: this.gameTypeId,
      jackpotTypeId: this.jackpotTypeId,
      searchType: SearchType.Winner
    };
    this.generate.emit(filterModel);
  }
}
