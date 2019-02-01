class DatePickerWidget {
/*
 * each class represents a differnet datepicker widget in the page with the id of datepicker_id
 */

    constructor(locale="el", id, mode=1){
    /*
     *  initializes class, by defining instance variables that will be later accessed by the class methods
     */
      this.mode = mode;
      
      this.datepicker = "datepicker_"+id;         //id of html div element
      this.widgetInputID  = "datepicker_input_"+id;   //id of html date input
      this.widgetImage    =  "img_datepicker_"+id;    //id of the html img 
      this.widgetID       = "datePickerWidget_"+id;   //id of popup widget
      //--- months lists translations ---
      this.monthList_el   = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];      this.monthList_en   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      //--- days initials translations ---
      this.daysList_el    = ['Κυρ','Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ'];
      this.daysList_en    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      //--- define default daysList & month List ---
      this.daysList       = this. daysList_el;        
      this.monthList      = this.monthList_el;
      this.selectedDay    = 0;  //initialize selected Day
      this.semaphore      = 0;  //initialize semamphore. This variable is used to determine if the popup widget should be closed or should be kept alive (visible)
      //--- set year, month, day to today ---
      let date          = new Date();
      this.currentDate  = new Date();
      this.selectedYear = date.getFullYear();
      this.selectedMonth= date.getMonth();
      this.selectedDay  = date.getDay();
      this.selectedDate = new Date();
      //--- translate dates according to locale defined ---
      if (locale=="el"){
          this.monthList=this.monthList_el;
          this.daysList=this.daysList_el;
      }else if(locale=="en"){
          this.monthList=this.monthList_en;
          this.daysList=this.daysList_en;
      }
      //--- bind actions to input so that widget pops and closes apropriately ---
      document.getElementById(this.widgetInputID).setAttribute("onfocus","window['"+this.widgetID+"'].show();");
      document.getElementById(this.widgetInputID).setAttribute("onfocusout","window['"+this.widgetID+"'].hide();");
      document.getElementById(this.widgetImage).setAttribute("onclick","window['"+this.widgetID+"'].setToday();");
      document.getElementById(this.widgetImage).setAttribute("title","set today");
      this.start();
    };

    setToday(){
    /*
     * defines instance variables that shows current date, to today. 
     * Todays date is determined by javascript, i.e. by the machine it runs
     */
        //--- change date, month, year to today ---
        this.selectedDate=new Date();
        this.selectedYear=this.selectedDate.getFullYear();
        this.selectedMonth=this.selectedDate.getMonth();
        this.changeYear(); //apply changes
        //--- highlight todays date ---
        var selected=document.querySelector("#"+this.datepicker+" .today");                 //get todays date
        this.select(selected,this.selectedYear,this.selectedMonth,this.selectedDate.getDate()); //highlight it and assign it to input
    }
    
    updateYearPicker(){
    /*
     * define year picker
     */
      var obj = this;
      setTimeout(function(){obj.allowToDie()},5); //during the selection of month or year, the widget is prevented from closing
                                                  //After the selection is made, allow it to close
      //--- define selected date, month, year ---
      let month = document.querySelector("#"+this.datepicker+" .year-picker .month").value;
      let year  = document.querySelector("#"+this.datepicker+" .year-picker .year ").value;
      let header_btn = document.querySelector("#"+this.datepicker+" .year-picker .header-button");
      this.selectedMonth = parseInt(month);
      this.selectedYear  = parseInt(year);
      
      //--- update button label ---
      header_btn.removeChild(header_btn.firstChild);
      header_btn.appendChild( document.createTextNode(this.monthList[month]+" "+year+" x") );
    }
    
    getDaysInMonth(month, year) {
    /*
     * return array of dates of specific month of specific year
     */
      let date = new Date(year, month, 1); 
      let days = [];
      while (date.getMonth() === month) {   //for each day in this month 
          days.push(new Date(date));        //append it to the array
          date.setDate(date.getDate() + 1); //get the next date
      }
      return days;
    };

    //=====return date[0-31], day[0-6]=========
    
    getFisrtDayOfMonth(month,year){
    /*
     * finds what weekday is the first day of the specified month
     */
      let date = new Date(year,month,1);  
      return [1, date.getDay()];
    };
    
    getLastDayOfMonth(month,year){
    /*
     * finds what weekday is the last day of the specified month
     */
      let date=new Date(year,month+1,1);
      date.setDate(date.getDate()-1);
      return [date.getDate(), date.getDay()];
    };
    
    appendElementAttribute(element,attribute, value){
    /*
     * generic function to append value value to a defined elements value
     */
      let currentValue=element.getAttribute(attribute);
      if(currentValue==null){
          element.setAttribute(attribute,value);
      }else if (currentValue.search(value)==-1){    //if value is not aleady a part of this attribute
          let updatedValue=currentValue+" "+value;
          element.setAttribute(attribute,updatedValue);
      }
    };

    removeElementAttribute(element,attribute,value){
    /*
     * generic function to remove value value to a defined elements value
     */
      let currentValue=element.getAttribute(attribute);
      if(currentValue.search(value)!=-1){ //if value exists in currentValue
          currentValue=currentValue.replace(value,'');
          element.setAttribute(attribute,currentValue);
      }
    };

    select(element,year,month,date){
    /*
     * select the specific date
     */
      let previous = document.querySelector("#"+this.datepicker+" .selected");  //find previously selected date
      if( previous!=null )
        previous.classList.remove("selected");                        //unhilight currentlty selected date
      element.classList.add("selected");                              //highlihgt new date
      month=month+1;
      this.currentDate  = new Date(year+"-"+month+"-"+date);
      let input=document.getElementById(this.widgetInputID);
      //--- sets the input value ---
      if( this.mode == 1) //  dd/mm/YYYY
          input.value = date.toString()+"/"+month.toString()+"/"+year.toString();
      else if( this.mode == 2)  // mm/dd/YYYY
          input.value = month.toString()+"/"+date.toString()+"/"+year.toString();        
      else  //  YYYY-mm-dd
          input.value = year.toString()+"-"+month.toString()+"-"+date.toString();        
      let selected=document.querySelector("#"+this.datepicker+" .selected")[0];
      if (selected!=null)
          this.removeElementAttribute(selected,"class","selected");
      this.appendElementAttribute(element,"class","selected");
    };
        
    keepAlive(){
    /*
     * sets semaphore to 1 thus preventing the widget from closeing on input focusout
     */
      this.semaphore = 1;
    }
    
    allowToDie(){
    /*
     * sets the semaphore to 0, indicating that it the widget is allowed to close
     */
      this.semaphore = 0;
      let inputID=this.widgetInputID;
      document.getElementById(inputID).focus();
    }

    chooseYear(){
    /*
     * creates the year picker panel, and places it on top of the widget
     */
      this.keepAlive(); //prevent the widget from closing
      //--- create DOM elements and attributes ---
      /*
       *  <div class="year-picker">
       *    <div><button class="header-button" type="button" onmousedown="window['datePickerWidget_1'].changeYear();">Φεβρουάριος 2020 x</button></div>
       *    <div class="body">
       *      <select class="month" onchange="window['datePickerWidget_1'].updateYearPicker();" onmousedown="window['datePickerWidget_1'].keepAlive();">
       *        <option value="0">Month_Name_1</option>
       *      </select>
       *      <input class="year" type="number" onmousedown="window['datePickerWidget_1'].keepAlive();" onchange="window['datePickerWidget_1'].updateYearPicker();">
       *    </div>
       *  </div>
       */
      let yearPicker = document.createElement("div"); 
      yearPicker.classList.add("year-picker");
      let header = document.createElement("div"); 
        let title=document.createElement("button");
        let tempText=this.monthList[this.selectedMonth]+" "+this.selectedYear.toString()+" x";
        let text=document.createTextNode(tempText);
        title.appendChild(text);
        title.classList.add("header-button");
        title.setAttribute("type","button");
        title.setAttribute("onmousedown","window['"+this.widgetID+"'].changeYear();");
        header.appendChild(title);
       
      let body = document.createElement("div");
      body.classList.add("body");
        let month = document.createElement("select");
        month.classList.add("month");
        month.setAttribute("onchange","window['"+this.widgetID+"'].updateYearPicker();");
        month.setAttribute("onmousedown","window['"+this.widgetID+"'].keepAlive();");
        for(let i=0; i<this.monthList.length;i++){
          let t = document.createElement("option");
          t.value = i;
          t.text = this.monthList[i];
          if( i == this.selectedMonth )
            t.setAttribute("selected","true");
          month.add(t);
        }
        let year = document.createElement("input");
        year.classList.add("year");
        year.setAttribute("type","number");
        year.setAttribute("onmousedown","window['"+this.widgetID+"'].keepAlive();");
        year.value = this.selectedYear;
        year.setAttribute("onchange","window['"+this.widgetID+"'].updateYearPicker();");
      body.appendChild(month);
      body.appendChild(year);
        
      yearPicker.appendChild(header);        
      yearPicker.appendChild(body);
      //---- append it to the widget ----
      document.getElementById(this.widgetID).appendChild(yearPicker); 
      var obj = this;
      setTimeout(function(){obj.allowToDie()},5); //allow the widget to close again
    }
    
    createCalendar(){
    /*
     * creates the popu widget
     */
      let today=new Date();//get today
      //--- create DOM elements ---
      let container=document.createElement("div");  //create the container
      container.setAttribute("id",this.widgetID);
      let header=document.createElement("div");     //create the title bar
      header.setAttribute("id","header_"+this.widgetID);
      //-- create left button --
      let leftButton=document.createElement("button");
      leftButton.setAttribute("class","leftButton");
      leftButton.setAttribute("type","button");
      let text=document.createTextNode("<");
      leftButton.setAttribute("onmousedown","window['"+this.widgetID+"'].changeMonth(-1);");
      leftButton.appendChild(text);
      //-- header title --
      let title=document.createElement("button");
      let tempText=this.monthList[this.selectedMonth]+" "+this.selectedYear.toString();
      text=document.createTextNode(tempText);
      title.appendChild(text);
      title.setAttribute("onmousedown","window['"+this.widgetID+"'].chooseYear();");
      title.setAttribute("type","button");
      //-- rightButton --
      let rightButton=document.createElement("button");
      rightButton.setAttribute("class","rightButton");
      rightButton.setAttribute("type","button");
      rightButton.setAttribute("onmousedown","window['"+this.widgetID+"'].changeMonth(1);");
      text=document.createTextNode(">");
      rightButton.appendChild(text);
      //-- append leftButton,title, rightButton to header --
      header.appendChild(leftButton);
      header.appendChild(title);
      header.appendChild(rightButton);
      //-- append header to widget --
      container.appendChild(header);
      //-- create widget body --
      let body=document.createElement("table");
      body.setAttribute("class","body_"+this.widgetID);
      //-- create body header --
      let daysHeader=document.createElement("tr");
      let daysListObj=[]
      for(let i=0;i<this.daysList.length;i++){
          daysListObj[i]=document.createElement("th");
          daysListObj[i].appendChild(document.createTextNode(this.daysList[i]));
          daysHeader.appendChild(daysListObj[i]);
      }
      body.appendChild(daysHeader);
      //-- create body content --
      let daysRow=[];
      let startDate=this.getFisrtDayOfMonth(this.selectedMonth,this.selectedYear);
      let endingDate=this.getLastDayOfMonth(this.selectedMonth,this.selectedYear);
      let dateObjList=[];
      let row=0;
      let dateIndex=1;
      //-- append every date of this month, of this year to the body --
      while(dateIndex<=endingDate[0]){
          daysRow[row]=document.createElement("tr");
          for(let day=0;day<=6;day++){    //for every column
              if((row==0 && startDate[1]<=day) || (row>0 && dateIndex<=endingDate[0])){
                  dateObjList[dateIndex]=document.createElement("td");
                  dateObjList[dateIndex].setAttribute("onmousedown","window['"+this.widgetID+"'].select(this,"+this.selectedYear+","+this.selectedMonth+","+dateIndex+");");
                  text=document.createTextNode(dateIndex);
                  dateObjList[dateIndex].appendChild(text);
                  if (dateIndex == today.getDate() && this.selectedMonth==today.getMonth() && this.selectedYear==today.getFullYear()){
                      dateObjList[dateIndex].setAttribute("class","today");
                  }
                  if (dateIndex == this.currentDate.getDate() && this.selectedMonth==this.currentDate.getMonth() && this.selectedYear==this.currentDate.getFullYear()){
                    dateObjList[dateIndex].classList.add("selected");
                  }
                  daysRow[row].appendChild(dateObjList[dateIndex]);
                  dateIndex++;
              }else{
                  daysRow[row].appendChild(document.createElement('td'));
              }
          }
          body.append(daysRow[row]);
          row++;
      }
      container.appendChild(body);
      
      //-- add container to the datepicker --
      document.getElementById(this.datepicker).appendChild(container);
    };
    
    show(){
    /*
     * show widget
     */
      document.getElementById(this.widgetID).style.display="inline-block"; 
      let inputID=this.widgetInputID;
    };
    hide(){
    /*
     * hide widget
     */
      if(this.semaphore==0)
        document.getElementById(this.widgetID).style.display="none";
    };
    
    start(){
    /*
     * gets month and year from of selected date and
     * initializes the widget to show this month and year
     */
      let date = this.selectedDate;
      this.selectedYear=date.getFullYear();
      this.selectedMonth=date.getMonth();
      this.createCalendar();
    };
    

    kill(){
    /*
     * destroys the current widget
     */
      let child=document.getElementById(this.widgetID);
      child.parentNode.removeChild(child);
    };
    
    changeYear(){
    /*
     * changes the selected year
     */
      this.selectedDate.setYear(this.selectedYear);
      this.changeMonth(0);
    }
        
    changeMonth(monthOffset){
    /*
     * changes the selected month
     */
      this.selectedDate.setMonth(this.selectedMonth+monthOffset);
      this.kill();
      this.start();
      let inputID=this.widgetInputID;
      setTimeout(function(){document.getElementById(inputID).focus()},5);
    };
};

function initDatePickerWidget(id, locale="el", mode=1){
/*
 * creates a new class instance for each input that called this function
 * and stores them in the global window variable for future reference
 *  id            = widgets id
 *  locale        = locale to use. Currently supported en, el
 *  mode          = 1:dd/mm/YYYY, 2:mm/dd/YYYY, 3:YYYY-mm-dd 
 */
  let varName = "datePickerWidget_"+id;
  window[varName] = new DatePickerWidget(locale, id, mode);
}
 
