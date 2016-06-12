//获取当前设备可以实用的屏幕宽度
documentWidth = window.screen.availWidth;
//定义棋盘宽度
gridContainerWidth = 0.92*documentWidth;
//定义小方块的边长
cellSideLength = 0.18*documentWidth;
//定义方块间距
cellSpace = 0.04*documentWidth;
console.log(documentWidth);
console.log(gridContainerWidth);
console.log(cellSideLength);
console.log(cellSpace);


//根据格子坐标获取top位置
function getPosTop(i, j) {
	return cellSpace + i * (cellSpace+cellSideLength);
}
//根据格子坐标获取left位置
function getPosLeft(i, j) {
	return cellSpace + j * (cellSpace+cellSideLength);
}
//根据数字获取格子背景颜色
function getNumberBackgrundColor(number) {
	switch (number) {
		case 2:
			return '#eee4da';
			break;
		case 4:
			return '#ede0c8';
			break;
		case 8:
			return '#f2b179';
			break;
		case 16:
			return '#f59563';
			break;
		case 32:
			return '#f67c5f';
			break;
		case 64:
			return '#f65e3b';
			break;
		case 128:
			return '#edcf72';
			break;
		case 256:
			return '#edcc61';
			break;
		case 512:
			return '#9c0';
			break;
		case 1024:
			return '#33b5e5';
			break;
		case 2048:
			return '#09c';
			break;
		case 4096:
			return '#a6c';
			break;
		case 8192:
			return '#93c';
			break;
		default:
			return 'black';
			break;
	}

	return 'black';
}
//根据数字获取格子文字颜色
function getNumberColor(number) {
	if (number <= 4)
		return '#776e65';

	return 'white';
}
//判断是否有空闲的格子
function nospace(board) {
	//若所有的board元素都为0则返回true，否则为false
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] == 0)
				return false;

	return true;
}
//判断能否向左移动
//判断条件：1，左边是否没有数字？2，左边的数字是否和自己相等？
function canMoveLeft(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
					return true;

	return false;
}
//判断能否向右移动
function canMoveRight(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--)
			if (board[i][j] != 0)
				if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
					return true;

	return false;
}
//判断能否向上移动
function canMoveUp(board) {
	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++)
			if (board[i][j] != 0)
				if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
					return true;

	return false;
}
//判断能否向下移动
function canMoveDown(board) {
	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--)
			if (board[i][j] != 0)
				if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
					return true;

	return false;
}
//判断第row行中从col1到col2中间是否有障碍物
function noBlockHorizontal(row, col1, col2, board) {
	for (var i = col1 + 1; i < col2; i++)
		if (board[row][i] != 0)
			return false;
	return true;
}
//判断第col列中从row1到row2中间是否有障碍物
function noBlockVertical(col, row1, row2, board) {
	for (var i = row1 + 1; i < row2; i++)
		if (board[i][col] != 0)
			return false;
	return true;
}
//判断是否可以继续移动
function nomove(board) {
	if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board))
		return false;
	return true;
}