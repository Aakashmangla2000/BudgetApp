
//BUDGET CONTROLLER 
var budgetController = (function(){


})();

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '. add__btn'
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //inc exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDomStrings: function(){
            return DOMStrings;
        }
    };


})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

var DOM = UICtrl.getDomStrings();
console.log(DOM.addButton);

var ctrlAddItem = function(){
    var input = UICtrl.getInput();
    console.log(input.description);
}

document.querySelector(DOM.addButton).addEventListener('click',ctrlAddItem);

document.addEventListener('keypress',function(event){
    if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
    }
});



})(budgetController, UIController);