(function(root) {
  var Game = root.Game = (root.Game || {});

  var View = Game.View = function View(el) {
    this.el = el;
    this.timer = null;
  }

  View.prototype.start = function () {
    var self = this;

    var snake = new Game.Snake();
    var board = new Game.Board(snake);
    $(document).keydown(function(event) {
      var key = event.keyCode;
      if (key === 40) {
        snake.turn('S');
      } else if (key === 38) {
        snake.turn('N');
      } else if (key === 39) {
        snake.turn('E');
      } else if (key === 37) {
        snake.turn('W');
      }
    });

    this.timer = setInterval(function() {
      self.step(board);
    }, 500)
    board.addApple();
  }

  View.prototype.step = function(board) {
    board.checkApple();
    board.snake.move();
    if (Math.random() < 0.05) {
      board.addApple();
    }
    if (board.checkCollision()) {
      alert("You lose!");
      clearInterval(this.timer);
      this.timer = null;
    } else {
      board.render(this.el);
    }
  };

})(this);