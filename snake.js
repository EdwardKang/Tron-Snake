(function(root) {
  var Game = root.Game = (root.Game || {});

  var Snake = Game.Snake = function Snake() {
    Snake.BOARD_WIDTH = 30;
    Snake.BOARD_HEIGHT = 30;
    this.dir = 'N';
    this.segments = [
    new Coord(Math.floor(Math.random() * Snake.BOARD_WIDTH),
      Math.floor(Math.random() * Snake.BOARD_HEIGHT)
    )];
  }

  Game.Snake.DIRECTION = {
    'N' : [0, -1],
    'S' : [0, 1],
    'E' : [1, 0],
    'W' : [-1, 0]
  }

  Snake.prototype.move = function() {
    for (var i = this.segments.length - 1; i > 0; i--) {
      this.segments[i].follow(this.segments[i - 1]);
    }
    this.segments[0].plus(this.dir);
  };

  Snake.prototype.turn = function(dir) {
    this.dir = dir;
  };

  var Board = Game.Board = function Board(snake, tron) {
    this.snakes = [snake, tron];
    this.apples = [];
  }

  Board.prototype.render = function(el) {
    var renderAll = $("#board div").length == 0;
    for ( var y = 0; y < Snake.BOARD_HEIGHT; y++) {
      if (renderAll) {
        el.append("<div id=\"y" + y + "\" class=\"row\"></div>");
      }
      for ( var x = 0; x < Snake.BOARD_WIDTH; x++) {
        var snake = _.find(this.snakes[0].segments, function(coord) {
          return coord.x == x && coord.y == y;
        });
        var tron = _.find(this.snakes[1].segments, function(coord) {
          return coord.x == x && coord.y == y;
        });
        var apple = _.find(this.apples, function(coord) {
          return coord.x == x && coord.y == y;
        });
        if (renderAll) {
          $('#y' + y).append('<div class=\"square\" id=\"x' + x + '\"></div>');
        }
        var cur = $("#y" + y + " #x" + x);
        cur.removeClass("snake");
        cur.removeClass("tron");
        cur.removeClass("apple");
        if (snake) {
          cur.addClass("snake");
        } else if (tron) {
          cur.addClass("tron");
        } else if (apple) {
          cur.addClass("apple");
        }
      }
    }
  }

  Board.prototype.addApple = function() {
    coord = new Coord(Math.floor(Math.random() * Game.Snake.BOARD_WIDTH), Math.floor(Math.random() * Game.Snake.BOARD_HEIGHT));
    this.apples.push(coord);
  }

  Board.prototype.checkApple = function () {
    var self = this;
    this.snakes.forEach(function(snake) {
      var head = snake.segments[0];
      var apple = _.find(self.apples, function(apple) {
        return apple.x == head.x && apple.y == head.y;
      });
      if (apple) {
        self.apples.splice(self.apples.indexOf(apple), 1);
        var coord = new Coord(-1, -1);
        coord.follow(_.last(snake.segments));
        snake.segments.push(coord);
      }
    });
  }

  Board.prototype.checkCollision = function () {
    var hitSelf, offBoard, hitOther;
    var self = this;
    this.snakes.forEach(function(snake, idx) {
      var head = snake.segments[0];
      segs = snake.segments.slice(1);

      hitSelf = hitSelf || _.find(segs, function(coord) {
        return coord.x == head.x && coord.y == head.y;
      });

      hitOther = hitOther || _.find(self.snakes[idx == 0 ? 1 : 0].segments, function(coord) {
        return coord.x == head.x && coord.y == head.y;
      });

      offBoard = offBoard || head.x < 0 ||
        head.x >= Game.Snake.BOARD_WIDTH ||
        head.y < 0 ||
        head.y >= Game.Snake.BOARD_HEIGHT;
    });
    return hitSelf || offBoard || hitOther;
  }

  function Coord(x, y) {
    this.x = x;
    this.y = y;
  }

  Coord.prototype.plus = function(dir) {
    var dir_arr = Snake.DIRECTION[dir];
    this.x += dir_arr[0];
    this.y += dir_arr[1];
  }

  Coord.prototype.follow = function(other) {
    this.x = other.x;
    this.y = other.y;
  }


})(this);