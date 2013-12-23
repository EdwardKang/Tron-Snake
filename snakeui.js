(function(root) {
  var Game = root.Game = (root.Game || {});

  var View = Game.View = function View(el) {
    this.el = el;
    this.timer = null;
    this.points = [0, 0];
    this.paused = false;
    this.topScores = [50, 40, 30, 20, 10];
  }

  View.prototype.start = function () {
    var self = this;
    this.updateLeaderBoard();
    var snake = new Game.Snake();
    var tron = new Game.Snake();
    var board = new Game.Board(snake, tron);
    $(document).keydown(function(event) {
      var key = event.keyCode;
      var moving = snake;

      if (key > 40) {
        moving = tron;
      }

      if (key === 40 || key === 83) {
        moving.turn('S');
      } else if (key === 38 || key === 87) {
        moving.turn('N');
      } else if (key === 39 || key === 68) {
        moving.turn('E');
      } else if (key === 37 || key === 65) {
        moving.turn('W');
      }
    });

    $("#pause").on("click", function() {
      if (self.paused) {
        self.unpause(board);
      } else {
        self.pause(board);
      }
      $("#pause").html(self.paused ? "Unpause" : "Pause");
    });

    this.timer = setInterval(function() {
      self.step(board);
    }, 500)
    board.addApple();
  }

  View.prototype.step = function(board) {
    this.board = board;
    board.checkApple();
    board.snakes.forEach(function(snake) {
      snake.move();
    });
    this.points = board.snakes.map(function(s) {
      return (s.segments.length - 1) * 10;
    });
    this.points.forEach(function(pts, i) {
      $("#points_" + i).html(pts);
    });
    if (Math.random() < 0.05) {
      board.addApple();
    }
    if (board.checkCollision()) {
      alert("You lose!");
      this.updateScores();
      this.updateLeaderBoard();
      clearInterval(this.timer);
      this.timer = null;
    } else {
      board.render(this.el);
    }
  };

  View.prototype.pause = function(board) {
    clearInterval(this.timer);
    this.paused = true;
  }

  View.prototype.unpause = function(board) {
    var self = this;
    clearInterval(view.timer);
    this.timer = setInterval(function() {
      self.step(board);
    }, 500)
    this.paused = false;
  }

  View.prototype.updateLeaderBoard = function() {
    $("#leaderboard").html('<tr><th>LeaderBoard: Scores</th></tr>');
    this.topScores.forEach(function(score) {
      $('#leaderboard').append("<tr><td>" + score + "</td></tr>");
    });
  }

  View.prototype.updateScores = function() {
    this.topScores.push(this.points[0]);
    this.topScores.push(this.points[1]);
    this.topScores = this.topScores.sort().reverse().slice(0, 5);
  }

})(this);