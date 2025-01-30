import { Injectable } from '@angular/core';
import { MyEvent } from './event.interface';
import { SolutionNode } from './solutionnode.interface';

@Injectable({ providedIn: 'root' })
export class EventSchedulerService {
    private events: MyEvent[] = [];
    private solution: SolutionNode[] = [];
    private minSolution: SolutionNode[] = [];
    private allSolutions: SolutionNode[][] = [];

    constructor() {

    }

    setEvents(events: MyEvent[]): void {
        this.events = events;
    }

    findSolution(events: MyEvent[]): SolutionNode[][] {
        this.solution = [];
        this.minSolution = [];
        this.allSolutions = [];
        this.events = events;
        this.solve(events);
        return this.allSolutions;
    }

    findMinSolution(events: MyEvent[]): SolutionNode[][] {
        this.solution = [];
        this.minSolution = [];
        this.allSolutions = [];
        this.events = events;
        this.solve(events);

        this.minSolution = this.allSolutions[0];
        for (let sns of this.allSolutions) {
            if (this.solScore(this.minSolution) > this.solScore(sns)) {
                this.minSolution = sns;
            }
        }

        return this.allSolutions.filter(s => this.solScore(s) == this.solScore(this.minSolution));
    }

    private solve(tempEvents: MyEvent[]): void {
        for (const e of tempEvents) {
            if (this.canAddEventToSolution(e)) {
                const sn = this.getNextSolutionNode(e);
                this.solution.push(sn);

                if (this.solution.length === this.events.length) {
                    this.storeSolution();
                } else {
                    this.solve(this.buildTempEvents(tempEvents, e));
                }

                this.solution.pop();
            }
        }
    }

    private storeSolution(): void {
        this.allSolutions.push([...this.solution]);

        if (!this.minSolution || this.computeTime(this.minSolution) > this.computeTime(this.solution)) {
            this.minSolution = [...this.solution];
        }
    }

    private computeTime(sol: SolutionNode[]): number {
        if (sol.length > 0) {
            const start = sol[0];
            const end = sol[sol.length - 1];
            return (end.hh - start.hh) * 60 + (end.mm - start.mm);
        }
        return -1;
    }

    private buildTempEvents(tempEvents: MyEvent[], e: MyEvent): MyEvent[] {
        const copiedArray: MyEvent[] = JSON.parse(JSON.stringify(tempEvents));
        return copiedArray.filter(event => event !== e);
    }

    private getNextSolutionNode(e: MyEvent): SolutionNode {
        if (this.solution.length === 0) {
            return { event: e, hh: e.hh, mm: e.mm };
        }
        const lastNode = this.solution[this.solution.length - 1];
        return this.getNextPossibleSolutionNodeForSolutionNode(lastNode, e);
    }

    private canAddEventToSolution(e: MyEvent): boolean {
        return !this.solution.some(sn => sn.event.name === e.name);
    }

    private getNextPossibleSolutionNodeForSolutionNode(solutionNode: SolutionNode, ev: MyEvent): SolutionNode {
        let hh2 = solutionNode.hh;
        let mm2 = solutionNode.mm;

        mm2 += solutionNode.event.duration;
        if (mm2 >= 60) {
            mm2 = mm2 % 60;
            hh2++;
        }

        if (ev.mm > mm2) {
            return { event: ev, hh: this.getNextHour(hh2, ev), mm: ev.mm };
        } else {
            return { event: ev, hh: this.getNextHour(hh2 + 1, ev), mm: ev.mm };
        }
    }

    private getNextHour(hh2: number, ev: MyEvent): number {
        var temp = ev.hh;
        while (true) {
            if (temp < hh2) {
                temp += Math.ceil(ev.repetition / 60);
            } else {
                return temp;
            }
        }
        //return hh2 + Math.ceil(ev.repetition / 60); // FIXME this would fail if repeat is 30 !!!
    }

    public solScore(sn: SolutionNode[]): number {
        var first = sn[0];
        var last = sn[sn.length - 1];
        return (last.hh - first.hh) * 60 + (last.mm - first.mm);
    }
}

