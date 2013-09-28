/*
*
*
*
*
*
*/
// --------------------------------------- Global variables ----------------------
var timeIntervalMin=25;
var timeBreakMin = 5;

/*
* reload wanrning
*
*
*
*
*/
// window.onbeforeunload = function (evt) {
// 	var message = "Are you sure you want to leave, all recorded info will lost";
// 	if (typeof evt == 'undefined') {
// 		evt = window.event;
// 	}
// 	if (evt) {
// 		evt.returnValue = message;
// 	}
// 	return message;
// } //reload wanrning


$(document).ready(function(){
	var countDownIntervalControl;
    /*
     *
     *
     *
     *
     *
     */
    $('body').on('click','.addStep',function(){
        var stepRow="";
        stepRow = '\<div class=\'step input-group\'>   \
                            <span class=\'input-group-addon\'>   \
                            <input type=\'checkbox\'>        \
                            </span>                        \
                            <input type=\'text\' class=\'stepContent form-control \'>  \
                                <span class=\'input-group-btn\'>        \
                                    <button class=\'addStep btn btn-default\' type=\'button\'><span class=\'glyphicon glyphicon-chevron-down\'></span></button>\
                                </span>                               \
                                <span class=\'input-group-btn\'>        \
                                    <button class=\'deleteStep btn btn-default\' type=\'button\'><span class=\'glyphicon glyphicon-trash\'></span></button>    \
                                </span>                                                                                                                  \
                     </div><!-- /input-group -->';


        $(this).parent().parent().after(stepRow);
    });
    /*
     *
     *
     *
     *
     *
     */
    $('body').on('click','.deleteStep',function(){
        $(this).parent().parent().remove();
    });










    /*
     *submit to google doc
     *
     *google doc first row:
     *Number	Goal	Info	Start	End	   Finish Rate(%)
     *
     */

	$('body').on('click', ".submitRow", function() {
		//rowIndex is native javascript and .index() is jquery object
		//this is why there's no $() around "this" and parentElement is not a method.
		var rowIndex = this.parentElement.parentElement.rowIndex;
		var date = getRealContentFromCell(".historyTable",rowIndex,0);
		var goal = getRealContentFromCell(".historyTable",rowIndex,1);
		var info = getRealContentFromCell(".historyTable",rowIndex,2);
		var start = getRealContentFromCell(".historyTable",rowIndex,3);
		var end = getRealContentFromCell(".historyTable",rowIndex,4);
		console.log(end);
		var finishRate = getRealContentFromCell(".historyTable",rowIndex,5);
		$("#googleForm #goal").val(goal);
		$("#googleForm #date").val(date);
		$("#googleForm #info").val(info);
		$("#googleForm #start").val(start);
		$("#googleForm #end").val(end);
		$("#googleForm #finishRate").val(finishRate);
		//wait for tryout
		
		//console.log( "value from number is :" +$("#googleForm number").val(number) );
		//googleForm = $("#googleForm");				
		//console.log("using input chain from jquery see if it will work: "+googleForm.input[0]);
		
		//submit form
       $("#googleForm").submit();
       delCurrentRow($(this));
   	});


	/*
	*
	*fade out effect
	*
	*
	*
	*/
	// $(".inputWrapper").fadeTo(0, 0.5); // initial opacity

	// $(".inputWrapper").hover(
	// function(){
	// 	$(this).animate({ opacity: 0.8 });	
	// },
	// function() {
	// 	$(this).animate({ opacity: 0.1 }); 
	// });

	// $(".historyWrapper").hover(
	// function(){
	// 	$(this).stop().animate({ opacity: 0.8 });	
	// },
	// function() {
	// 	$(this).stop().animate({ opacity: 0.1 }); 
	// });// fade out effect


	// --------------------------------------- countDown plugin ------------------------------
	

	// --------------------------------------- history table operation ------------------------------

	/*
	*
	*delete row of the clicked button
	*
	*
	*
	*/
	//this: returns a tage: input tag. <input xxxxxxx>
	//$(this)：returns an object: o.fn.o.init. so that you cant use parent() method, and other jquery method!
	//.click() won't work on dynamic added DOM element. Using .live('click',function(){}) will work
	$('body').on('click',".deleteRow", function(){
		delCurrentRow($(this));
	});

	/*
	*
	* play music
	*
	*
	*
	*/
	$(".musicStopButtion").click(function(){
		toggleMusic();		
		window.clearTimeout(countDownIntervalControl);		
	});

	/*
	*
	* interrupt
	*
	*
	*
	*/
	$(".interruptButtion").click(function(){
			
	});

	
	/*
	*
	* start plan: start counting, insert to history table
	*
	*
	*
	*/
	$(".currentStartButton").click(function(){

		//get the row number
		//console.log(this.parentElement.parentElement.rowIndex);	
		//update time in input table
		setContentCell(getCertainTimeHourMinFromNow(0),".inputTable",1,2 );	
		setContentCell(getCertainTimeHourMinFromNow(timeIntervalMin*60),".inputTable",1,3 );
		$('.startTime').html(getCertainTimeHourMinFromNow(0));
		$('.endTime').html(getCertainTimeHourMinFromNow(timeIntervalMin*60));

		//save to Array
        // rowArray used for table plan UI
		var rowArray = getRowToArray(".inputTable",1);
        // planArray used for thumbnail plan UI
        var planArray = getPlanCardToArray('.planCard');
        planArray.push($('.startTime').html());
        planArray.push($('.endTime').html());

		//save to history table
		attachArrayToHistoryTable(planArray);

		//$('#expireMessage').countdown('option', {until: shortly}); 		
		//callback function, just put name. NO () after it! otherwise, the function will be called!
		$('.countDown').countdown('destroy');
		countDownIntervalControl = window.setTimeout('finishFocusPeriod()',timeIntervalMin*60000);
		$('.countDown').countdown({until: timeIntervalMin*60, compact: true, description: ''});
		var current_perc = 0;
		//self clear. the interval remove itself
        var progress = setInterval(function() {
        	var perc = 100;
        	console.log("q")
        	var progressBar =$('.progress-bar');
            if (current_perc>=perc) {
                clearInterval(progress);
            } else {
                current_perc +=perc/(timeIntervalMin*60);
                progressBar.css('width', (current_perc)+'%');
            }

            progressBar.text((current_perc|0)+'%');

        }, 1000);
	});
})// $(document).ready(function(){}


/*
 * loop over details steps to get the steps in a formated string
 *
 *
 *
 *
 */
function sumSteps(){
    var sumSteps = "";
    var stepNumber = 0;
    $('.stepsGroup .stepContent').each(function(){
        stepNumber ++;
        sumSteps = sumSteps + stepNumber.toString() + "." +$(this).val() + "\n";
    });
    return  sumSteps;
}

/*
*update bar progress
*
*
*
*
*/

// function barUpdate(){
// 	var usedTime = endTime - startTime - leftTime;
// 	var timePeriod = endTime - startTime;
// 	usedTimePercentage =  usedTime/timePeriod | 0 ;
// 	$('progress-bar').css("width") = new String( usedTimePercentage )+"%";
// }

function watchCountdown(periods) { 
	barUpdate();

}



/*
*
* get array from input table to history table
*
*
*
*/
function attachArrayToHistoryTable(rowArray){
	var newRow = "<tr> \
    		<td>_date_</td> \
    		<td><textarea class='goal' rows='3' cols='18' >_goal_</textarea></td> \
    		<td><textarea class='info' rows='3' cols='18' >_info_</textarea></td> \
    		<td>_startTime_</td> \
    		<td>_endTime_</td> \
    		<td><textarea class='finishRate' rows='3' cols='3' /></td> \
    		<td><textarea class='finishRateReason' rows='3' cols='18' placeholder='Be accurate about finish rate' /></td> \
    		<td><input class='submitRow btn btn-primary btn-block' type='button' value='submit'> \
    			<input class='deleteRow btn btn-primary btn-block type='button' value='delete'>  </td>\
    		</tr>";
    newRow = newRow.replace("_date_",new Date().getMonth() + "/" + new Date().getDate() );
    newRow = newRow.replace("_goal_",rowArray[0]);
    newRow = newRow.replace("_info_",rowArray[1]);
    newRow = newRow.replace("_startTime_",rowArray[2]);
    newRow = newRow.replace("_endTime_",rowArray[3]);
	$(".historyTable tbody").append(newRow);
}

/*
*
* get the rowIndex of the cell which the button is located in
*
*
*
*/
function getRowIndexOfButton(thisObject){
	console.log("getrowIndex:");
	console.log(thisObject.parent().parent().index());
	return thisObject.parent().parent().Index();
}

/*
*
* delete row which the button is located in
*
*
*
*/
//you have to pass in the "$(this)" object. otherwiase using $(this) in the function will get a different "this" which is the one that called this function
function delCurrentRow(clickedThisObj){
	clickedThisObj.parent().parent().remove();			
}

/*
*
* toggle the music
*
*
*
*/
function toggleMusic(){
	var song = document.getElementsByTagName('audio')[0];
	if (song.paused)
		song.play();
	else
		song.pause();			

}//toggle the music

/*
*
* finish the focus period: toggles the music and start the break period
*
*
*
*/
function finishFocusPeriod(){
	toggleMusic();
	startBreak();			
}

/*
*
* start the break period
* set countDown to break period time
*
*
*/
function startBreak(){			
	var breakTimeout = window.setTimeout('finishBreak()', timeBreakMin*60000);
	$('.countDown').countdown('destroy');
	$('.countDown').countdown({until: timeBreakMin*60, compact: true, description: '' ,onTick: barUpdate});
}

/*
*
* finish the break period
* 
*
*
*/
function finishBreak(){
	toggleMusic();
}

/*
*
* get Time in form hh:mm
* returns the current time + timeInterval_second
*
*
*/
function getCertainTimeHourMinFromNow(timeInterval_second){
	var TimeNow = new Date();
	var certainTime = new Date( TimeNow.getTime() + timeInterval_second * 1000 );
	var certainTimeHourMin = certainTime.getHours() + ":" + certainTime.getMinutes();
	return certainTimeHourMin;
}


//--------------------------------- table element manipulation -------------------------------------
/*
*Goal | Info | Start Time | End Time | Time Left
*(1,0)|(1,1) |(1,2)		|
*(2,0)|(2,1) |(2,2)		|
*/

function generateCellSelector(jQueryTableSelector,row,column){
	var cellSelector = 'jQueryTableSelector tr:eq(row) td:eq(column)'
	cellSelector = cellSelector.replace("jQueryTableSelector",jQueryTableSelector);
	cellSelector = cellSelector.replace("row",row);
	cellSelector = cellSelector.replace("column",column);
	return cellSelector;
}

function getContentCellTextarea(jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	return $(targetSelector + " textarea").val();
}

function setContentCellTextarea(jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	return $(targetSelector + " textarea").val();
}

function getContentCellInputText(jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	return $(targetSelector + " input").val();
}

function getContentCell(jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	return $(targetSelector).text();
}

function setContentCellInputText(cellContent,jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	target = $(targetSelector + " input").val(cellContent);
}
function setContentCell(cellContent,jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	target = $(targetSelector).html(cellContent);
}

function getContentCellInnerHtml(jQueryTableSelector,row,column){
	targetSelector = generateCellSelector(jQueryTableSelector,row,column);
	return $(targetSelector).html();
}
/*
*
* Get the useful data from the cell shell. 
* They could be in input, textarea, innerhtml
* 
* 
*/
function getRealContentFromCell(jQueryTableSelector,row,column){
	tdElement = $(generateCellSelector(jQueryTableSelector,row,column));
	if (tdElement.children("textarea").length ){		
		return getContentCellTextarea(jQueryTableSelector,row,column);
	}
	else if (tdElement.children("input").length ){
		return getContentCellInputText(jQueryTableSelector,row,column);
	}
	else if (tdElement.text() != ""){
		return getContentCellInnerHtml(jQueryTableSelector,row,column);
	}
}


/*
 *
 * get data from a row of a table into an array
 * row is the actul row, not including the th, it starts from 1.
 * if succeed, return the array, else return empty array
 *
 */
function getRowToArray(jQueryTableSelector,row){
    var column = 0;
    var rowArray = [];

    //check if table not exists, using the jQuery's object's length
    var table = $(jQueryTableSelector)
    console.log(table);
    if ( table.length == 0 ){
        console.log("Can't find table to get the row");
    }
    console.log(table.children("tbody").children("tr"));
    if (table.children("tbody").children("tr").length == 0){
        console.log("This table doesn't have a row");
    }
    else{
        for (column = 0;column < table.children("tbody").children("tr").children("td").length; column ++){
            rowArray.push( getRealContentFromCell(jQueryTableSelector,row,column));
        }
    }
    return rowArray;
}

/*
 *
 * get data from a plan card into an array
 *
 * if succeed, return the array, else return empty array
 *
 */
function getPlanCardToArray(jQueryTableSelector){
    var planArray = [];

    //check if table not exists, using the jQuery's object's length
    var planCard = $(jQueryTableSelector)
    if ( planCard.length == 0 ){
        console.log("Can't find planCard");
    }
    if (planCard.find('.goal').length == 0){
        console.log("The goal doesn't exist");
    }
    else{
        planArray.push(planCard.find('.goal').val());
    }

    planArray.push( sumSteps() );
    console.log(planArray);
    return planArray;
}