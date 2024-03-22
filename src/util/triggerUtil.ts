export class TriggerUtil {
    static setTrigger(functionName: string, at: Date) {
        this.deleteTriggerByFunctionName(functionName);
        this.createTrigger(functionName, at);
    }

    private static createTrigger(functionName: string, at: Date): void {
        ScriptApp.newTrigger(functionName).timeBased().at(at).create();
    }

    private static deleteTriggerByFunctionName(functionName: string): void {
        ScriptApp.getProjectTriggers()
            .filter((trigger) => trigger.getHandlerFunction() === functionName)
            .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
    }
}
