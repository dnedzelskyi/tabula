interface EventMessage {
  alertMessage: string;
}

export interface AlertUserEventDetail extends CustomEventInit<EventMessage> {
  detail: EventMessage;
}

export class AlertUserEvent extends CustomEvent<EventMessage> {
  static readonly typeName = 'notify-user';

  constructor(message: AlertUserEventDetail) {
    super(AlertUserEvent.typeName, message);
  }

  static create(alertMessage: string): AlertUserEvent {
    return new AlertUserEvent({
      detail: { alertMessage },
    });
  }
}
