import { RootStore } from "./rootStore";
export declare class CommandExecutor {
    private _rootStore;
    constructor(rootStore: RootStore);
    execute: (command: ICommand) => void;
}
interface ICommand {
    execute(rootStore: RootStore): any;
}
export {};
//# sourceMappingURL=commandExecutor.d.ts.map