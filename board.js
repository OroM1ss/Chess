let create_game = function () {
    let arr = [];
    for (let i = 0; i < 8; i++) {
        arr[i] = new Array(8);
    }
    for (let n = 0; n < 8; n++) {
        arr[1][n] = "BP";
        arr[6][n] = "WP"; 
    }

    //BLACK SIDE
    arr[0][0] = "BR";
    arr[0][7] = "BR";
    arr[0][1] = "BN";
    arr[0][6] = "BN";
    arr[0][2] = "BB";
    arr[0][5] = "BB";
    arr[0][3] = "BQ";
    arr[0][4] = "BK";
    
    //WHITE SIDE
    arr[7][0] = "WR";
    arr[7][7] = "WR";
    arr[7][1] = "WN";
    arr[7][6] = "WN";
    arr[7][2] = "WB";
    arr[7][5] = "WB";
    arr[7][3] = "WQ";
    arr[7][4] = "WK";
    
    return arr;
}

let pieces_moves = {
    __move_direction_line: function (ret, y, x, dy, dx, opposite) {
        y += dy;
        x += dx;
        for (; x >= 0 && x < 8 && y >= 0 && y < 8;) {
            if (chess_board[y][x] != undefined) {
                if (chess_board[y][x][0] === opposite)
                    ret.push([y, x])
                break
            }
            ret.push([y, x])
            x += dx;
            y += dy;
        }
    },

    next_move_queen: function (y, x, primary_line, direction, opposite) {
        let ret = []
        this.__move_direction_line(ret, y, x, 0, 1, opposite);
        this.__move_direction_line(ret, y, x, 0, -1, opposite);
        this.__move_direction_line(ret, y, x, -1, 0, opposite);
        this.__move_direction_line(ret, y, x, 1, 0, opposite);
        this.__move_direction_line(ret, y, x, -1, 1, opposite);
        this.__move_direction_line(ret, y, x, 1, 1, opposite);
        this.__move_direction_line(ret, y, x, 1, -1, opposite);
        this.__move_direction_line(ret, y, x, -1, -1, opposite);

        console.log(ret);
        return ret;
    },

    next_move_bishop: function (y, x, primary_line, direction, opposite) {
        let ret = []
        this.__move_direction_line(ret, y, x, -1, 1, opposite);
        this.__move_direction_line(ret, y, x, 1, 1, opposite);
        this.__move_direction_line(ret, y, x, 1, -1, opposite);
        this.__move_direction_line(ret, y, x, -1, -1, opposite);

        console.log(ret);
        return ret;
    },

    next_move_rook: function (y, x, primary_line, direction, opposite) {
        let ret = []
        this.__move_direction_line(ret, y, x, 0, 1, opposite);
        this.__move_direction_line(ret, y, x, 0, -1, opposite);
        this.__move_direction_line(ret, y, x, -1, 0, opposite);
        this.__move_direction_line(ret, y, x, 1, 0, opposite);
        console.log(ret);

        return ret;
    },

    __knight_move: function (ret, y, x, dy, dx, opposite) {
        y += dy;
        x += dx;
        if (y >= 8 || y < 0 || x >= 8 || x < 0) {
            return
        }
        if (chess_board[y][x] == undefined || chess_board[y][x][0] == opposite) {
            ret.push([y, x]);
        }
    },

    next_move_knight: function (y, x, primary_line, direction, opposite) {
        let ret = []
        this.__knight_move(ret, y, x, -2, -1, opposite);
        this.__knight_move(ret, y, x, -2, 1, opposite);
        this.__knight_move(ret, y, x, -1, 2, opposite);
        this.__knight_move(ret, y, x, 1, 2, opposite);
        this.__knight_move(ret, y, x, 2, 1, opposite);
        this.__knight_move(ret, y, x, 2, -1, opposite);
        this.__knight_move(ret, y, x, 1, -2, opposite);
        this.__knight_move(ret, y, x, -1, -2, opposite);

        console.log(ret);

        return ret;
    },

    __king_move: function (ret, y, x, dy, dx, opposite) {
        y += dy;
        x += dx;
        if (y >= 8 || y < 0 || x >= 8 || x < 0) {
            return
        }
        if (chess_board[y][x] == undefined || chess_board[y][x][0] == opposite) {
            ret.push([y, x]);
        }
    },

    next_move_king: function (y, x, primary_line, direction, opposite) {
        let ret = []
        this.__king_move(ret, y, x, -1, -1, opposite);
        this.__king_move(ret, y, x, 0, -1, opposite);
        this.__king_move(ret, y, x, 1, -1, opposite);
        this.__king_move(ret, y, x, 1, 0, opposite);
        this.__king_move(ret, y, x, 1, 1, opposite);
        this.__king_move(ret, y, x, 0, 1, opposite);
        this.__king_move(ret, y, x, -1, 1, opposite);
        this.__king_move(ret, y, x, -1, 0, opposite);

        console.log(ret);

        return ret;
    },

    next_move_pawn: function (y, x, primary_line, direction, opposite) {
        let ret = []
        let y_new = y + direction;
        let x_new = x;
        if (y_new < 0 || y_new >= 8) {
            return ret;
        }
        if (y === primary_line) {
            let y_long = y + 2 * direction;

            if (y_long > 0 && chess_board[y_long][x_new] === undefined && chess_board[y_new][x_new] === undefined) {
                ret.push([y_long, x_new]);
            }
        }
        if (chess_board[y_new][x_new] === undefined) {
            ret.push([y_new, x_new]);
        }

        possible_attack(y + 1 * direction, x - 1, opposite, ret);
        possible_attack(y + 1 * (direction), x + 1, opposite, ret);

        return ret;
    }
};

let next_move = function (y, x) {
    let ret = [];
    let direction;
    let opposite;
    let primary_line;
    let cell = chess_board[y][x];
    if (cell[0] === "W") {
        primary_line = 6;
        direction = -1;
        opposite = "B";

    }
    else if (cell[0] === "B") {
        primary_line = 1;
        direction = 1;
        opposite = "W";
    }
    else {
        return ret;

    }

    if (cell === "WP" || cell === "BP") {
        return pieces_moves.next_move_pawn(y, x, primary_line, direction, opposite);
    }
    if (cell === "WR" || cell === "BR") {
        return pieces_moves.next_move_rook(y, x, primary_line, direction, opposite);
    }
    if (cell === "WQ" || cell === "BQ") {
        return pieces_moves.next_move_queen(y, x, primary_line, direction, opposite);
    }
    if (cell === "WB" || cell === "BB") {
        return pieces_moves.next_move_bishop(y, x, primary_line, direction, opposite);
    }
    if (cell === "WN" || cell === "BN") {
        return pieces_moves.next_move_knight(y, x, primary_line, direction, opposite);
    }
    if (cell === "WK" || cell === "BK") {
        return pieces_moves.next_move_king(y, x, primary_line, direction, opposite);
    }
    

    return ret;
}

let chess_board = create_game();

let possible_attack = function (y, x, side, next_moves) {
    let candidate = chess_board[y][x];
    if (candidate != undefined) {
        if (candidate[0] === side) {
            next_moves.push([y, x]);
        }
    }
}

let has_figure = function (row, column) {
    return chess_board[row][column] !== undefined;
}

let is_empty = function (row, column) {
    return !has_figure(row, column)
}

let select_figure = function (row, column) {
    if (!has_figure(row, column)) {
        return
    }
    if ((column >= 0 && column < 8) && (row >= 0 && row < 8)) {
        CURRENT_FIGURE = [row, column];
    }
}