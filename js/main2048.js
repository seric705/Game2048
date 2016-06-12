//游戏数据存储定义
//游戏面板数据
var board = new Array();
//游戏分数
var score = 0;
//记录每个格子每一步操作是否已经发生过一次碰撞
var hasConflicted = new Array();

//触摸开始坐标定义和结束坐标定义
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
	//用于适应移动端尺寸
	prepareForMobile();
	newgame();
});

function prepareForMobile() {
	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	$('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

//开始新游戏
function newgame() {
	//初始化棋盘格
	init();
	//在随机的两个格子生成数字
	generateOneNumber();
	generateOneNumber();

}

function init() {
	//双重循环遍历每个小格子
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			//获取小格子对象
			var gridCell = $('#grid-cell-' + i + '-' + j);
			//根据i，j计算小格子的top和left
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}

	//初始化游戏面板数字数据
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			//初始化无碰撞发生
			hasConflicted[i][j] = false;
		}

	}

	//根据board数组内容更新页面内容
	updateBoardView();
	//分数初始化
	score = 0;
	updateScore(score);
}

function updateBoardView() {
	//	先清空所有的数字元素
	$('.number-cell').remove();
	//	双重循环重新添加数字元素
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);
			//根据数字内容不同显示不同样式
			if (board[i][j] == 0) {
				//如果数字为0，则设置宽和高为0，即不显示
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				//如果不为0的情况，则覆盖在背景框上面
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				//设置背景色
				theNumberCell.css('background-color', getNumberBackgrundColor(board[i][j]));
				//设置文字颜色
				theNumberCell.css('color', getNumberColor(board[i][j]));
				//填充文字
				theNumberCell.text(board[i][j]);
			}
			//重新初始化碰撞矩阵，表示新的一轮开始了
			hasConflicted[i][j] = false;
		}
		//调整屏幕尺寸调整方格样式
	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', 0.4 * cellSideLength + 'px');
	$('.number-cell').css('border-radius', 0.02 * cellSideLength);
}

//随机在一个空闲的格子里生成一个数字
function generateOneNumber() {
	//先判断是否有空闲的格子
	if (nospace(board))
		return false;
	//随机一个位置
	//产生一个0，1，2，3中的整数
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	//让计算机猜50次，猜不到就人工找到一个可用的位置，目的是为了提高运算速度
	var times = 0
	while (times < 50) {
		if (board[randx][randy] == 0)
			break;
		//重新随机产生一个新位置	
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));

		times++;
	}
	//人工找到一个空格
	if (times == 50) {
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					randx = i;
					randy = j;
				}
			}
	}

	//随机一个数字，2或者4
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在随机的位置显示随机数字
	board[randx][randy] = randNumber;
	//动画显示数字
	showNumberWithAnimation(randx, randy, randNumber);
	return true;
}
//监听玩家按下的数字并进行相应
$(document).keydown(function(event) {
	switch (event.keyCode) {
		case 37: //left
			//防止按键滚动滚动条
			event.preventDefault();
			//判断是否可以移动
			if (moveLeft()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
			break;
		case 38: //up
			//防止按键滚动滚动条
			event.preventDefault();
			//判断是否可以移动
			if (moveUp()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
			break;
		case 39: //right
			//防止按键滚动滚动条
			event.preventDefault();
			//判断是否可以移动
			if (moveRight()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
			break;
		case 40: //down
			//防止按键滚动滚动条
			event.preventDefault();
			//判断是否可以移动
			if (moveDown()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
			break;
		default:
			break;
	}
});

document.addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
//为了解决安卓4.0Bug
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend', function(event) {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.2 * documentWidth)
		return;

	if (Math.abs(deltax) >= Math.abs(deltay)) {
		//x
		if (deltax > 0) {
			//move right
			if (moveRight()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
		} else {
			//move left
			if (moveLeft()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
		}
	} else {
		//y
		if (deltay > 0) {
			//move down
			if (moveDown()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
		} else {
			//move up
			if (moveUp()) {
				//生成一个新的随机数
				setTimeout('generateOneNumber()', 210);
				//判断是否游戏结束
				setTimeout('isgameover()', 300);
			}
		}
	}
});


//判断游戏结束
function isgameover() {
	//没有空格也不能移动就游戏结束
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}
//游戏结束提示
function gameover() {
	alert('小马哥棒棒哒！');
}
//向左移动
function moveLeft() {
	//先判断是否可以向左移动
	if (!canMoveLeft(board))
		return false;
	//对每一个数字左侧的数字进行判断，看是否可以为落脚点，判断条件如下
	//1.落脚点位置是否为空
	//2.落脚点位置数字和待判定元素数字是否相等
	//3.移动路径中是否有障碍物
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				//注意此时循环的变量范围是0到j，即判断数字左侧的元素
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						//处理碰撞
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
		//根据board数组内容更新页面内容
	setTimeout('updateBoardView()', 200);
	return true;
}

//向右移动
function moveRight() {
	//先判断是否可以向右移动
	if (!canMoveRight(board))
		return false;
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						//处理碰撞
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
		//根据board数组内容更新页面内容
	setTimeout('updateBoardView()', 200);
	return true;
}

//向上移动
function moveUp() {
	//先判断是否可以向上移动
	if (!canMoveUp(board))
		return false;
	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						//处理碰撞
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
		//根据board数组内容更新页面内容
	setTimeout('updateBoardView()', 200);
	return true;
}

//向下移动
function moveDown() {
	//先判断是否可以向下移动
	if (!canMoveDown(board))
		return false;
	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						//处理碰撞
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
		//根据board数组内容更新页面内容
	setTimeout('updateBoardView()', 200);
	return true;
}