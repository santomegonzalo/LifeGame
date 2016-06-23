'use strict';

describe('LifeGame', () => {
    const GameLife = require('../js/life');
    let game;
    
    beforeEach(() => {
        game = new GameLife(null, 40 , 40, 10, []);
    });

    it('cells before init', () => {
        expect(game.getCells().all.length).toEqual(0);
        expect(game.getCells().alive.length).toEqual(0);
    });

    it('cells after init', () => {
        game.init();
        expect(game.getCells().all.length).toEqual(40);
        expect(game.getCells().alive.length).toEqual(0);
    });

    it('cells after one step', () => {
        game.defineAliveCells([{column: 10, row: 10}]);
        expect(game.getCells().alive.length).toEqual(1);

        game.nextStep();
        expect(game.getCells().alive.length).toEqual(0);
    });

    it('cells after three step', () => {
        game.defineAliveCells([{column: 1, row: 0}, {column: 2, row: 0}, {column: 3, row: 0}]);
        expect(game.getCells().alive.length).toEqual(3);

        game.nextStep();
        expect(game.getCells().alive.length).toEqual(2);

        game.nextStep();
        expect(game.getCells().alive.length).toEqual(0);
    });
});
