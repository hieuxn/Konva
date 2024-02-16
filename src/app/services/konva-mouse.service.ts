import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KonvaMouseService {
    private mouseDown = new Subject<MouseEvent>();
    private mouseUp = new Subject<MouseEvent>();
    private mouseMove = new Subject<MouseEvent>();
    private mouseContextMenu = new Subject<MouseEvent>();

    public mouseDown$ = this.mouseDown.asObservable();
    public mouseUp$ = this.mouseUp.asObservable();
    public mouseMove$ = this.mouseMove.asObservable();
    public mouseContextMenu$ = this.mouseContextMenu.asObservable();

    public handleMouseDown(event: MouseEvent) {
        this.mouseDown.next(event);
    }

    public handleMouseUp(event: MouseEvent) {
        this.mouseUp.next(event);
    }

    public handleMouseMove(event: MouseEvent) {
        this.mouseMove.next(event);
    }

    public handleMouseContextMenu(event: MouseEvent) {
        this.mouseContextMenu.next(event);
    }
}