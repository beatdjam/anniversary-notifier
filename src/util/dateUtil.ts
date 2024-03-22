export class DateUtil {
    static getNextDay(origin: Date): Date {
        const setTime: Date = new Date(origin.getTime());
        setTime.setDate(setTime.getDate() + 1);
        setTime.setHours(0);
        setTime.setMinutes(0);
        return setTime;
    }

    static getDiffYM(from: Date, to: Date): string | null {
        // 日付が異なる場合は判定しない
        if (to.getDate() != from.getDate()) return null;

        // N年差
        if (to.getMonth() == from.getMonth()) return `${to.getFullYear() - from.getFullYear()}年`;

        // N年Nヶ月差
        const diffY = to.getFullYear() - from.getFullYear();
        const diffM = to.getMonth() - from.getMonth();

        const month = diffM < 0 ? `${12 + diffM}ヶ月` : `${diffM}ヶ月`;
        if (diffY == 0 || (diffY == 1 && diffM < 0)) return `${month}`;
        else if (diffM < 0) return `${diffY - 1}年${month}`;
        else return `${diffY}年${month}`;
    }
}
