import { MessageRepository } from './repository/messageRepository';
import { TriggerUtil } from './util/triggerUtil';
import { DateUtil } from './util/dateUtil';

const firstDay = new Date('2014/05/25');

function setTrigger() {
    TriggerUtil.setTrigger('createMessage', DateUtil.getNextDay(new Date()));
}

function createMessage() {
    const msg = getMessage(new Date());
    if (msg != null) return new MessageRepository().broadcast(msg);
}

function debug() {
    const msg = getMessage(new Date());
    if (msg != null) return new MessageRepository().push(msg);
}

export function getMessage(today: Date): string | null {
    const diffDateString = DateUtil.getDiffYM(firstDay, today);
    if (diffDateString == null) return null;
    return `今日は${diffDateString}記念日です！`;
}
