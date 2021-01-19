$(document).ready(function(){ 

  //функция генерации алфавита 
  
  function generate_keyboad(){
      var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      var block = $('.keyboard_block .keyboard');
      block.html('');

      $.each(alphabet, function(index, value){
          var letter = $('<button class="key"></button>');
          letter.html(value).prop('draggable', 'true').attr('id', letter.html());
          block.append(letter);
      });
  }
  
  generate_keyboad();

  var wordlist = {}, //объект для хранения данных json
      inputs = $('input[type="radio"]'), //инпуты для выбора темы игры
      keys = $('.key'), // сгенерированная клава, что будет перетаскиваться
      target_area = $('.drop_field'), // цель назначения для перетаскиваемых клавиш
      theme_span = $('#theme'), // для отображения темы
      word_span = $('#word'), // для отображения слова
      choosen_theme = '', // выбранная тема с помощью инпутов
      random_word = '', //рандомное слово по теме
      answer = [], //массив-ответ, который меняеться по ходу игры
      words = []; // массив всех слов темы


  //достаем из файла .json данные
  
  $.getJSON( "wordlist.json", function( data ) {
      $.each( data, function( key, val ) {
          wordlist[key] = val;
        });
  });

  //при выборе темы пользователем, печатаем ее и выбираем рандомное слово 

  $.each(inputs, function(){
      $(this).on('change',(function(){
          choosen_theme = $(this).val();
          words = Object.keys(wordlist[choosen_theme]);
          theme_span.html(choosen_theme);
          random_word = words[Math.floor(Math.random() * words.length)];
          answer = [];
          $.each(random_word.split(''), function(index){ // запись слова в массив и отображение
              let letter = $('<span></span>');
              if (random_word[index] == '-') letter.html('-');
              else letter.html('_');
              answer[index] = letter;
          });
          word_span.html(answer); // вставка угадываемого слова
          var dragged_elems = target_area.find('.key'); // находим все буквы, что таскались до этого
          if (dragged_elems){ // если они есть в поле
              $.each(dragged_elems, function(){
                  $(this).removeAttr('disabled').removeClass('disabled'); // возобновление их активности
                  $('.keyboard').append($(this)); // вставка обратно в клавиатуру
              });
          }
          target_area.find('h2.message').fadeIn(); // возобновление сообщения 

      }));
  });

  // делаем таргет целевым элементом

  target_area.on('dragover', function(e){
      e.originalEvent.preventDefault();
  });

  // когда клавиша попадант на поле

  target_area.on('drop', function(e){
      e.originalEvent.preventDefault();
      $(this).find('h2.message').fadeOut(); // исчезновение сообщения

      var data = e.originalEvent.dataTransfer.getData('text'); 
      console.log(data);
      var button = $('#' + data); // находим перетаскиваемую кнопку
      button.prop('disabled', 'true').addClass('disabled'); // делаем перетаскиваемую кнопку деактивированой
      $(this).append(button); //вставляем в поле

      // если такая буква есть в слове, показываем

      $.each(random_word.split(''), function(index, value){
          let letter = data.toLowerCase();
          if (value === letter) answer[index].html(letter).addClass('opened_letter');
      });
      word_span.html(answer);
  });

  $.each(keys, function(){
      $(this).on('dragstart', function(e){
          e.originalEvent.dataTransfer.effectAllowed = 'move';
          e.originalEvent.dataTransfer.dropEffect = 'move';
          e.originalEvent.dataTransfer.setData('text', $(this).attr('id'));
      });
  });

});
var options = ["*", "0", "3000", "2500", "4000", "1000", "0", "**", "4500", "5000", "0", "1000", "2000", "***", "0", "3500", "1000", "1000"];
let point =0;
var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  if(text != '**' && text != '***'){
  if(text == '*')
  {
    point = 0;
  }
  else{
    text= Number(text);
    point = point + text;
  }
}
var element = document.getElementById("point");
element.innerHTML = point;
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();


