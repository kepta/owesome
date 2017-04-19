import { Position, Toaster, Intent } from '@blueprintjs/core';

export const GenericToaster = Toaster.create({
    className: 'my-toaster',
    position: Position.TOP
});

export const WarningToaster = Toaster.create({
    iconName: 'warning-sign',
    intent: Intent.DANGER,
    position: Position.TOP
});
