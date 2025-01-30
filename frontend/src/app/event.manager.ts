import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { MyEvent } from './event.interface';
import { EventSchedulerService } from './event-scheduler.service';
import { SolutionNode } from './solutionnode.interface';

@Component({
    standalone: true,
    imports: [FormsModule, CommonModule],
    selector: 'app-event-manager',
    templateUrl: './event.manager.html',
    styles: []
})
export class EventManagerComponent {
    events: MyEvent[] = [];
    newEvent: MyEvent = { name: '', hh: 0, mm: 0, duration: 0, repetition: 0, selected: true };
    result: SolutionNode[][] = [];
    offset: number = 0;

    constructor(private dataService: DataService, private eventsService: EventSchedulerService) {
    }

    ngOnInit(): void {
        this.loadData();
    }

    saveData(): void {
        const data = { rows: this.events };
        this.dataService.saveData(data).subscribe((response) => {
            console.log(response.message);
        });
    }

    loadData(): void {
        this.dataService.loadData().subscribe((data) => {
            if (data.rows != undefined) {
                this.events = data.rows;
            }
        });
    }

    addEvent(): void {
        if (this.newEvent.name) {
            this.events.push({ ...this.newEvent });
            this.newEvent = { name: '', hh: 0, mm: 0, duration: 0, repetition: 0, selected: true };
            this.saveData();
        }
    }

    deleteEvent(index: number): void {
        this.events.splice(index, 1);
        this.saveData();
    }

    performComputation(): void {
        // Example computation: Calculate total event duration
        //var x = this.eventsService.findSolution(this.events);
        this.result = this.eventsService.findMinSolution(this.events.filter(ev => ev.selected));
    }

    getSNString(sns: SolutionNode[]): string {
        var result = "";

        for (let sn of sns) {
            result += "<B>" + sn.event.name + "</B>" + "(" + (sn.hh + this.offset) + ":" + sn.mm + ") ";
        }

        result += "[" + this.eventsService.solScore(sns) + "]";

        return result;
    }

}
