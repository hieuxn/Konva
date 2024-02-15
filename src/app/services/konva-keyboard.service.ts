import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KonvaKeyboardService {
    private keyDown = new Subject<KeyboardEvent>();
    private keyUp = new Subject<KeyboardEvent>();

    public keyDown$ = this.keyDown.asObservable();
    public keyUp$ = this.keyUp.asObservable();

    public handleKeyDown(event: KeyboardEvent) {
        this.keyDown.next(event);
    }

    public handleKeyUp(event: KeyboardEvent) {
        this.keyUp.next(event);
    }
}