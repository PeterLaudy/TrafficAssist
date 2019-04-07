import { GPSConverter } from './gps-converter';

describe('GPSConverter', () => {
    it('should create an instance', () => {
         expect(new GPSConverter([1, 1, 1, 1])).toBeTruthy();
    });
});
