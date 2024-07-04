import { AlertComponent } from "../components";
import { AlertUserEvent } from "./events/alert";
import App from "./application";

export default class AlertsModule {
    private get alertComponent() {
        return document?.querySelector(
            AlertComponent.tagName
        ) as InstanceType<typeof AlertComponent>;
    }

    constructor(app: App) {
        app.addEventListener(
            AlertUserEvent.typeName,
            (event: Event) => this.onNotifyUserHandler(event)
        );
    }

    private onNotifyUserHandler(event: Event) {
        if (!this.alertComponent) {
            return;
        }

        const userEvent = event as AlertUserEvent;
        this.alertComponent.broadcast(userEvent.detail.alertMessage);
    }
}