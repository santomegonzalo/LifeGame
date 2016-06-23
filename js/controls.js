window.onload = function () {

    const game = new GameLife(document.getElementById('life'), 40 , 40, 10, []).init();
    window.game = game;

    const changeControlsState = function( running ) {
        if( running ) {
            document.querySelector('.js-game-start').classList.add('disabled');
            document.querySelector('.js-game-stop').classList.remove('disabled');
        }
        else {
            document.querySelector('.js-game-stop').classList.add('disabled');
            document.querySelector('.js-game-start').classList.remove('disabled');
        }
    };

    document.querySelectorAll('input').forEach( element => element.addEventListener('blur', ( e ) => {
        if( e.target.value === undefined ) {
            return;
        }

        changeControlsState( false );

        switch( e.target.dataset.type ) {
            case 'columns':
                game.changeColumns(e.target.value);
                break;
            case 'rows':
                game.changeRows(e.target.value);
                break;
            case 'cellsize':
                game.changeCellSize(e.target.value);
                break;
        }
    }));

    document.querySelectorAll('input').forEach( element => element.addEventListener('keypress', ( e ) => {
        if( e.keyCode === 13 ) {
            e.target.blur();
        }
    }));

    document.querySelector('.js-game-start').addEventListener('click', () => {
        changeControlsState( true );
        game.start();
    });

    document.querySelector('.js-game-stop').addEventListener('click', () => {
        changeControlsState( false );
        game.stop();
    });

    document.querySelector('.js-game-clear').addEventListener('click', () => {
        changeControlsState( false );
        game.stop();
        game.clear( true );
    });
};
