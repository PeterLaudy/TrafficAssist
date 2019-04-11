import { RouteAndTrafficCombination } from './routeandtrafficcombo';
import { OpenRouteModel } from '../services/openroute.model';

describe('Routeandtrafficcombo', () => {
    it('should create an instance', () => {
        expect(new RouteAndTrafficCombination(new OpenRouteModel())).toBeTruthy();
    });
});
