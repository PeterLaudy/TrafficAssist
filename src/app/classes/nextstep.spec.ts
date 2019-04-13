import { NextStep } from './nextstep';

describe('NextStep', () => {
    it('should throw an error when called with null parameters', () => {
        expect(new NextStep(null, null)).toThrow();
    });
});
