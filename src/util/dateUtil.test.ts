import { DateUtil } from './dateUtil';

test('getNextDay', () => {
    expect(DateUtil.getNextDay(new Date(2021, 0, 1))).toEqual(new Date(2021, 0, 2));
});

test('getDiffYM', () => {
    // NOTE: 同年同日は0年が返るがケアしない
    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2021, 0, 2))).toBe(null);

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2021, 1, 1))).toBe('1ヶ月');

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2022, 0, 1))).toBe('1年');

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2022, 1, 1))).toBe('1年1ヶ月');

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2023, 0, 1))).toBe('2年');

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2023, 1, 1))).toBe('2年1ヶ月');

    expect(DateUtil.getDiffYM(new Date(2021, 0, 1), new Date(2023, 2, 1))).toBe('2年2ヶ月');
});
