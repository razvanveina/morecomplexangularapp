import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

interface DataRecord {
  positive: number;
  negative: number;
}

interface DataRow {
  hour: number;
  dataRecord: DataRecord[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, CommonModule],
  providers: [DecimalPipe]
})
export class AppComponent implements OnInit {
  currentTime: { hour: number; minute: number };
  columns: string[] = ['', '00-15', '15-30', '30-45', '45-00'];
  rows: DataRow[] = Array.from({ length: 18 }, (_, rowIndex) => ({
    hour: rowIndex + 6,
    dataRecord: [{ positive: 0, negative: 0 }, { positive: 0, negative: 0 }, { positive: 0, negative: 0 }, { positive: 0, negative: 0 }]
  }));

  constructor(private dataService: DataService, private decimalPipe: DecimalPipe) {
    this.currentTime = this.getCurrentTime();
  }

  getCurrentTime(): { hour: number; minute: number } {
    const now = new Date();
    return {
      hour: now.getHours(),    // Returns the current hour (0-23)
      minute: now.getMinutes() // Returns the current minute (0-59)
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  saveData(): void {
    const data = { rows: this.rows };
    this.dataService.saveData(data).subscribe((response) => {
      console.log(response.message);
    });
  }

  loadData(): void {
    this.dataService.loadData().subscribe((data) => {
      if (data.rows != undefined) {
        this.rows = data.rows;
      }
    });
  }

  displayDataRecordValue(dr: DataRecord): string {
    if (dr.positive == 0 && dr.negative == 0) {
      return "--";
    }
    return this.decimalPipe.transform(100.0 * dr.positive / (dr.positive + dr.negative), '1.0-2') || '';
  }

  plusClick(i: number, j: number) {
    this.rows[i].dataRecord[j].positive++;
    this.saveData();
  }
  minusClick(i: number, j: number) {
    this.rows[i].dataRecord[j].negative++;
    this.saveData();
  }

  getBackgroundClass(dr: DataRecord, i: number, j: number): string[] {
    var result: string[] = [];

    if (dr.positive == 0 && dr.negative == 0) {
      result.push("bg-white");
    } else if (dr.positive / (dr.positive + dr.negative) > 0.9) {
      result.push("bg-green");
    } else if (dr.positive / (dr.positive + dr.negative) < 0.2) {
      result.push("bg-red");
    } else if (dr.positive / (dr.positive + dr.negative) < 0.5) {
      result.push("bg-redlite");
    } else if (dr.positive / (dr.positive + dr.negative) > 0.6) {
      result.push("bg-greenlite");
    } else {
      result.push("bg-yellow");
    }

    if (i + 6 == this.currentTime.hour) {
      if (this.currentTime.minute >= j * 15 && this.currentTime.minute < j * 15 + 15) {
        result.push("td-border");
      }
    }
    return result;
  }

}
