import { ContextMenuCommandBase } from "./context-menu-command-base";
export type Action = () => void;
export class ContextMenuGenericCommand extends ContextMenuCommandBase {
    public override name!: string;
    private action!: Action;

    public constructor(name: string, action: Action) {
        super();
        this.name = name;
        this.action = action;

    }
    public override execute(): void {
        this.action();
    }

    public static Create(name: string, action: Action): ContextMenuCommandBase {
        return new ContextMenuGenericCommand(name, action);
    }
}