(function(root) {
  var Game = root.Game = (root.Game || {});

  var View = Game.View = function View(el) {
    this.el = el;
    this.timer = null;
    this.points = 0;
    this.paused = false;
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

    $("#pause").on("click", function() {
      if (self.paused) {
        self.restart(board);
      } else {
        self.pause(board);
      }
      $("#pause").html(self.paused ? "Restart" : "Pause");
    });

    this.timer = setInterval(function() {
      self.step(board);
    }, 100)
    board.addApple();
  }

  View.prototype.step = function(board) {
    this.board = board;
    board.checkApple();
    board.snake.move();
    this.points = (board.snake.segments.length - 1) * 10;
    $("#points").html(this.points);
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

  View.prototype.pause = function(board) {
    clearInterval(this.timer);
    this.timer = null;
    this.paused = true;
  }

  View.prototype.restart = function(board) {
    var self = this;
    this.timer = setInterval(function() {
      self.step(board);
    }, 100)
    this.paused = false;
  }

})(this);