export abstract class ContextMenuCommandBase {
    public abstract name: string;
    public abstract execute(): void;
}