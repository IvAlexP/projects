var quiz =
{
	"JS":
	[
		{
			"id": 1,
			"question": "După un pas,  algoritmul lui Kruskal a selectat muchia [1,4]. Ce muchie va fi selectată în continuare?<br><img src=\"" + "img/graf1.png" + "\" height=\"150\">",
			"options":
			[
				{
					"a": "[4,6]",
					"b": "[3,5]",
					"c": "[2,3]"
				}
			],
			"answer": "[3,5]",
			"score": 0,
			"status": ""
		},
		
		{
			"id": 2,
			"question": "Care dintre următoarele subgrafuri parțiale se poate obține după selectarea a 3 muchii prin algoritmul lui Kruskal?<br><img src=\"" + "img/graf2_e.png" + "\" height=\"150\">",
			"options":
			[
				{
					"a": "<img src=\"" + "img/graf2_g1.png" + "\" height=\"130\">",
					"b": "<img src=\"" + "img/graf2_c.png" + "\" height=\"130\">",
					"c": "<img src=\"" + "img/graf2_g2.png" + "\" height=\"130\">"
				}
			],
			"answer": "<img src=\"" + "img/graf2_c.png" + "\" height=\"130\">",
			"score": 0,
			"status": ""
		},
		
		{
			"id": 3,
			"question": "Care va fi complexitatea algoritmului lui Kruskal în cazul în care am reprezentat graful prin lista muchiilor? (considerăm că muchiile sunt ordonate crescător)",
			"options":
			[
				{
					"a": "m*m",
					"b": "n*m",
					"c": "n*n"
				}
			],
			"answer": "n*n",
			"score": 0,
			"status": ""
		},
		
		{
			"id": 4,
			"question": "Care va fi conținutul vectorului cc după selectarea primelor 5 muchii ale grafului dat conform algoritmului lui Kruskal?<br><img src=\"" + "img/graf4.png" + "\" height=\"150\">",
			"options":
			[
				{
					"a": "1 1 3 4 5 3 3 3 3",
					"b": "1 1 1 4 5 1 1 8 9",
					"c": "1 1 3 4 5 7 7 7 3"
				}
			],
			"answer": "1 1 3 4 5 3 3 3 3",
			"score": 0,
			"status": ""
		},
		
		{
			"id": 5,
			"question": "La fiecare moment al aplicării algoritmului lui Kruskal subgraful parțial obținut este conex.",
			"options":
			[
				{
					"a": "Adevărat",
					"b": "Fals"
				}
			],
			"answer": "Fals",
			"score": 0,
			"status": ""
		},
	]
}

var quizApp = function ()
{
	this.score = 0;
	this.qno = 1;
	this.currentque = 0;
	var totalque = quiz.JS.length;
	
	this.displayQuiz = function (cque)
	{
		this.currentque = cque;
		if (this.currentque < totalque)
		{
			$("#tque").html(totalque);
			$("#previous").attr("disabled", false);
			$("#next").attr("disabled", false);
			$("#qid").html(quiz.JS[this.currentque].id + '.');
			$("#question").html(quiz.JS[this.currentque].question);
			$("#question-options").html("");
			for (var key in quiz.JS[this.currentque].options[0])
			{
				if (quiz.JS[this.currentque].options[0].hasOwnProperty(key))
				{
					$("#question-options").append
					(
						"<div class='form-check option-block'>" +
						"<input type='radio' class='form-check-input' name='option' id='q" +
						"' value='" +
						quiz.JS[this.currentque].options[0][key] +
						"'><span>" +
						quiz.JS[this.currentque].options[0][key] +
						"</span>"
					);
				}
			}
		}
		if (this.currentque <= 0) { $("#previous").attr("disabled", true); }
		if (this.currentque >= totalque)
		{
			$('#next').attr('disabled', true);
			for (var i = 0; i < totalque; i++) { this.score = this.score + quiz.JS[i].score; }
			return this.showResult(this.score);
		}
	}
	
	this.showResult = function (scr)
	{
		$("#result").addClass('result');
		$("#result").html("<div class='rez'>Punctaj: &nbsp;" + scr + "</div>");
		for (var j = 0; j < totalque; j++)
		{
			var res;
			if (quiz.JS[j].score == 0) { res = '<span class="wrong">' + quiz.JS[j].score + '</span><i class="fa fa-remove c-wrong"></i>'; }
			else { res = '<span class="correct">' + quiz.JS[j].score + '</span><i class="fa fa-check c-correct"></i>'; }
			$("#result").append
			(
				'<div class="raspuns"><b>' + quiz.JS[j].id + '.</b>' +' &nbsp;' +
				quiz.JS[j].question + '</div>' +
				'<div><r>Răspuns corect:</r> &nbsp;' + quiz.JS[j].answer + '</div>' +
				'<div>Scor: &nbsp;' + res + '</div>'
			);
		}
	}
	
	this.checkAnswer = function (option)
	{
		if (option == quiz.JS[this.currentque].answer)
		{
			if (quiz.JS[this.currentque].score == "")
			{
				quiz.JS[this.currentque].score = 1;
				quiz.JS[this.currentque].status = "correct";
			}
		}
		else { quiz.JS[this.currentque].status = "wrong"; }
	}
	
	this.changeQuestion = function (cque)
	{
		this.currentque = this.currentque + cque;
		this.displayQuiz(this.currentque);
		
	}
}

var jsq = new quizApp();
var selectedopt;

$(document).ready
(	
	function ()
	{
		jsq.displayQuiz(0);
		$('#question-options').on
		(
			'change', 'input[type=radio][name=option]',
			function (e)
			{
				$(this).prop("checked", true);
				selectedopt = $(this).val();
			}
		);
	}
);

$('#next').click
(
	function (e)
	{
		e.preventDefault();
		if (selectedopt) { jsq.checkAnswer(selectedopt);}
		jsq.changeQuestion(1);
	}
);


$('#previous').click
(
	function (e)
	{
		e.preventDefault();
		if (selectedopt) { jsq.checkAnswer(selectedopt); }
		jsq.changeQuestion(-1);
	}
);
