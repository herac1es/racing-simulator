// Keep the actual game check outside the specialized legacy helpers.
function amazingGameAllowed() {
    var game = $prop('DataCorePlugin.CurrentGame') || $prop('GameName') || '';
    game = String(game).toLowerCase();
    if (game) return game === 'iracing';
    // No game selected: preserve desktop lighting and controller feedback.
    return !$prop('DataCorePlugin.GameRunning') && !$prop('GameRunning');
}

function amazingUnsupportedGame() {
    return new Array(56).fill(amazingGameAllowed() ? null : '#FF000000');
}
