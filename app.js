
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

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
    
 
    var data = {

        allItems: {
            exp: [],
            inc: []
        },
        
        totals: {
            exp: 0,
            inc: 0
        }, 
        budget: 0,
        percentage: -1

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

            calculateBudget: function(){
                calculateTotal('exp');
                calculateTotal('inc');

                data.budget = data.totals.inc - data.totals.exp;

                if( data.totals.inc > 0 )
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
                else 
                data.percentage = -1;
            },

            getBudget: function(){
                return {
                    budget: data.budget,
                    totalexp: data.totals.exp,
                    totalinc: data.totals.inc,
                    percentage: data.percentage
                }
            },

            deleteItem: function(type, id){
                var ids, index; 
                ids = data.allItems[type].map(function(current){
                    return current.id;
                });

                index = ids.indexOf(id);

                if(index !== -1 ){
                    data.allItems[type].splice(index, 1);
                }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeBudget: '.budget__income--value',
        expensesBudget: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //inc exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        clearFields: function(){
            var fields, fArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fArray = Array.prototype.slice.call(fields);

            fArray.forEach(function(current, index, array){
                current.value = "";
            });

            fArray[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeBudget).textContent = obj.totalinc;
            document.querySelector(DOMStrings.expensesBudget).textContent = obj.totalexp;
            
            if(obj.percentage > 0)
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            else
            document.querySelector(DOMStrings.percentageLabel).textContent = "__";

        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);

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

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    };

    var DOM = UICtrl.getDomStrings();
    console.log(DOM.addButton);

    var updateBudget = function(){
        budgetCtrl.calculateBudget();
        var budg = budgetCtrl.getBudget(); 
        UICtrl.displayBudget(budg);
    }

    var ctrlAddItem = function(){
        var input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            var newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            UIController.addListItem(newItem, input.type);
            UIController.clearFields();
            updateBudget();
        }     
    };

    var ctrlDeleteItem = function(event){
        var itemId, splitId, type, id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            budgetCtrl.deleteItem(type,id);
            UICtrl.deleteListItem(itemId);
            updateBudget();
        }



        console.log(itemId,type,id);
    };


    return {
        init: function(){
            console.log('hi');
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalexp: 0,
                totalinc: 0
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();