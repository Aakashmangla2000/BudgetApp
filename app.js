
//BUDGET CONTROLLER 
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
 
    var data = {

        allItems: {
            exp: [],
            inc: []
        },
        
        totals: {
            exp: 0,
            inc: 0
        }

    };

        return {
            addItem: function(type, des, val){

                if(data.allItems[type].length > 0)
                iD = data.allItems[type][data.allItems[type].length - 1].id + 1;
                else
                iD = 0; 

                if( type === 'exp'){
                    newItem =  new Expense(iD, des, val);
                }
                else{
                    newItem = new Income(iD, des, val);
                }

                data.allItems[type].push(newItem);
                 return newItem;
            },

            display: function(){
                console.log(data);
            }
        };
          
})();

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //inc exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        getDomStrings: function(){
            return DOMStrings;
        }
    };


})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        document.querySelector(DOM.addButton).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    };

    var DOM = UICtrl.getDomStrings();
    console.log(DOM.addButton);

    var ctrlAddItem = function(){
        var input = UICtrl.getInput();
        var newItem = budgetController.addItem(input.type,input.description,input.value);
        UIController.addListItem(newItem, input.type);

    };


    return {
        init: function(){
            console.log('hi');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();