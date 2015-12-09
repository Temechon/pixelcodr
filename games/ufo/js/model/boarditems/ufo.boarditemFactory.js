var UFO = UFO || {};

/**
 * Constructor
 * @param game
 * @constructor
 */
UFO.BoardItemFactory = function(game) {
    this.game = game;

    // The array of cumulatives probability for all items
    this.weights = [];

    // The array linking the item name and its probability
    this.items = [
        {item:"kzark", p:0.15},
        {item:"crystal", p:0.25},
        {item:"laser", p:0.15},
        {item:"shield", p:0.2},
        {item:"potion", p:0.25}
    ];

    this.updateWeights();
};

/**
 * Creates a random item at the given pixel position (x,y) and at the given board position (col, line);
 * @param x
 * @param y
 * @param line
 * @param col
 */
UFO.BoardItemFactory.prototype.create = function(x, y, line, col) {

    // Get the item to create wy its weight
    var seed = this.game.rnd.realInRange(0, 1);
    var lastw = 0;
    var index = 0;

    for (var i=0; i<this.weights.length; i++) {
        var w = this.weights[i];
        if (seed > lastw && seed <= w) {
            index = i;
            break;
        } else {
            lastw = w;
        }
    }

    var g;
    switch (index) {
        case 0 :
            g = new UFO.Alien(this.game, x, y, line, col);
            break;
        case 1 :
            g = new UFO.Crystal(this.game, x, y, line, col);
            break;
        case 2 :
            g = new UFO.Laser(this.game, x, y, line, col);
            break;
        case 3 :
            g = new UFO.Shield(this.game, x, y, line, col);
            break;
        case 4 :
            g = new UFO.Potion(this.game, x, y, line, col);
            break;
    }

    return g;
};


/**
 * Creates the array of cumulatives probability for each items. Example =>
 *
 * This is your array of items: [apple, banana, pineapple]
 * This is the array of probabilities: [0.3, 0.3, 0.4]
 * This is the array of weights: [0.3, 0.6, 1.0]
 */
UFO.BoardItemFactory.prototype.updateWeights = function() {
    var that = this;
    this.weights = [];
    var probaSum = 0;

    this.items.forEach(function(tuple) {
        probaSum += tuple.p;
        that.weights.push(probaSum);
    });
};

/**
 * Increase the probability to creates an alien
 */
UFO.BoardItemFactory.prototype.increaseAlienWeight = function() {
    this.items[0].p += 0.01;

    var dp = 0.01 / this.items.length;

    for (var i= 1; i<this.items.length; i++) {
        this.items[i].p -= dp;
    }

    this.updateWeights();
};