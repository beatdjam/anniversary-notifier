import { getMessage } from './main';

describe('getMessage', () => {
    test('N年記念日', () => {
        expect(getMessage(new Date(2015, 4, 25))).toEqual('今日は1年記念日です！');
    });

    test('Mヶ月記念日 4月以前', () => {
        expect(getMessage(new Date(2015, 0, 25))).toEqual('今日は8ヶ月記念日です！');
    });

    test('N年Mヶ月記念日 4月以前', () => {
        expect(getMessage(new Date(2022, 1, 25))).toEqual('今日は7年9ヶ月記念日です！');
    });

    test('N年Mヶ月記念日 6月以後', () => {
        expect(getMessage(new Date(2015, 10, 25))).toEqual('今日は1年6ヶ月記念日です！');
    });

    test('記念日無し', () => {
        expect(getMessage(new Date(2021, 0, 1))).toEqual(null);
    });
});
