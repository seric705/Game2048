//显示随机数字动画
function showNumberWithAnimation(i, j, randNumber) {
	//获取操纵数字格子
	var numberCell = $('#number-cell-' + i + '-' + j);
	//改变格子样式
	numberCell.css('color', getNumberColor(randNumber));
	numberCell.css('background-color', getNumberBackgrundColor(randNumber));
	numberCell.text(randNumber);
	//制作显示动画
	numberCell.animate({
		width: cellSideLength,
		height: cellSideLength,
		top: getPosTop(i, j),
		left: getPosLeft(i, j)
	}, 50);
}

//移动数字动画
function showMoveAnimation(fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-' + fromx + '-' + fromy);
	numberCell.animate({
		top: getPosTop(tox, toy),
		left: getPosLeft(tox, toy)
	}, 200);
}
//分数变化
function updateScore(score){
	$('#score').text(score);
}
