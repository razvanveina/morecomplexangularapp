import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule]
})
export class AppComponent implements OnInit {
  text: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadData();
  }

  saveData(): void {
    const data = { text: this.text };
    this.dataService.saveData(data).subscribe((response) => {
      console.log(response.message);
    });
  }

  loadData(): void {
    this.dataService.loadData().subscribe((data) => {
      this.text = data.text || '';
    });
  }
}
