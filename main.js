const CELLS = document.getElementsByClassName("cell"),
    WIN = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ],
    PENALTY = 0.2;
let player_states = [];
let enemy_states = [];
let active_cell;

for (cell of CELLS) {
    cell.addEventListener('click', function(e) {
        if (this.classList.contains("active")) {
            this.innerHTML = '○';
            this.classList.add("player");
            this.classList.remove("active");
            if (judge("player")) {
                alert("playerの勝利です!");
            } else {
                enemy_action();
                if (judge("enemy")) alert("enemyの勝利です...");
            }
        }
    });
}


let enemy_action = () => {
    get_states();
    let pos = move_optimizer();
    console.log(pos);
    try {
        CELLS[pos].innerHTML = 'X';
        CELLS[pos].classList.add("enemy");
        CELLS[pos].classList.remove("active");
    }
    catch (e) {
        alert("引き分けです");
    }
}

let get_states = () => {
    let cell;
    player_states = [];
    enemy_states = [];
    for (let i=0; i<CELLS.length; i++) {
        cell = CELLS[i];
        if (cell.classList.contains("player")) player_states.push(i);
        else if (cell.classList.contains("enemy")) enemy_states.push(i);   
    }
}

let move_optimizer = () => {
    let neutral = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(pos => !(player_states.includes(pos) || enemy_states.includes(pos)));
    let player_instance, enemy_instance;

    let win_move = [];
    let not_lose_move = [];
    let temp_neutral, temp_pos, predict;

    for (let i=0; i<neutral.length; i++) {
        temp_neutral = neutral.concat();
        temp_pos = temp_neutral[i];
        temp_neutral = temp_neutral.filter(x => x!=temp_pos);
        enemy_instance = enemy_states.concat([temp_pos]);
        predict = judge("enemy", true, enemy_instance);
        if (predict) win_move.push(temp_pos);
        else {
            for (let j=0; j<temp_neutral.length; j++) {
                temp_pos = temp_neutral[j];
                player_instance = player_states.concat([temp_pos]);
                predict = judge("player", true, player_instance);
                if (predict) not_lose_move.push(temp_pos);
            }
        }
    }

    console.log(win_move);
    console.log(not_lose_move);

    if (win_move.length > 0) return win_move[Math.floor(Math.random() * win_move.length)];
    else if (not_lose_move.length > 0) return not_lose_move[Math.floor(Math.random() * not_lose_move.length)];
    else return neutral[Math.floor(Math.random() * neutral.length)];
}

let judge = (side, predict=false, states=null) => {
    let filled = states || [],
        count;
    if (!predict) {
        for (let i=0; i<CELLS.length; i++) {
            if (CELLS[i].classList.contains(side)) filled.push(i);
        }
    }
    for (elms of WIN) {
        count = 0;
        elms.forEach(elm => {
            if (filled.includes(elm)) count++;
        })
        if (count == 3) {
            break;
        }
    };
    if (count === 3) {
        if (!predict) {
            for (elm of CELLS) {
                if (elm.classList.contains("active")) elm.classList.remove("active");
            }
        }
        return true;
    }
    else return false;
}
