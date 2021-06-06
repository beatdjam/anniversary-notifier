import {getMsg, getNextDay} from './main'

test('getNextDay', () => {
    expect(getNextDay(new Date(2021, 0, 1)))
        .toEqual(new Date(2021, 0, 2));
});

describe('getMsg', () => {
    test('N年記念日', () => {
        expect(getMsg(new Date(2015, 4, 25)))
            .toEqual('今日は1年記念日です！');
    });

    test('N年Mヶ月記念日', () => {
        expect(getMsg(new Date(2015, 10, 25)))
            .toEqual('今日は1年6ヶ月記念日です！');
    });

    test('記念日無し', () => {
        expect(getMsg(new Date(2021, 0, 1)))
            .toEqual(null);
    });
})