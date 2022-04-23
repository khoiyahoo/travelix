//Đối tượng Validator
export function Validator(options) {
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};
    //Hàm thực hiện validate
    function validate(inputElement, rule){
        var errorMessage;
        var errorElement = (getParent(inputElement,options.formGroupSelector)).querySelector(options.errorSelector);
      //Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];
        //Lặp qua từng rule để kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra;
        for(var i = 0; i <rules.length; i++) {
            switch (inputElement.type){
                case 'checkbox':
                case 'radio':
                    errorMessage= rules[i](formElement.querySelector(rule.selector) + ':checked');
                    break;
                default:
                    errorMessage= rules[i](inputElement.value);
            }
           
            if(errorMessage){
                break;
            }
        }
        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        }else {
            errorElement.innerText = ''
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
            
        }
        return !errorMessage;
    }
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            //Lặp qua từng rule
            options.rules.forEach(function(rule){
               var inputElements = formElement.querySelectorAll(rule.selector);    
               var isValid = validate(inputElements, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if(isFormValid){
                if(typeof options.onSubmit == 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]'); 
                    var formValues = Array.from(enableInputs).reduce(function(value, input){
                        
                        switch(input.type){
                            case 'radio':   
                                value[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;                 
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    value[input.name] = '';
                                    return value;
                                };
                                if(!Array.isArray(value[input.name])) {
                                    value[input.name] = [];
                                }
                                value[input.name].push(input.value);
                                break;
                            case 'file':
                                value[input.name] = input.files;
                                break;
                            default:
                                value[input.name] = input.value;
                        }
                        
                        
                        return value;
                    }, {})
                    options.onSubmit(formValues);
                }else {
                    formElement.submit();
                }
            }
        }
       options.rules.forEach(function(rule){
           //Lưu lại các rules cho các input 
      
           if(Array.isArray(selectorRules[rule.selector])){
             selectorRules[rule.selector].push(rule.test);
           }else{
               selectorRules[rule.selector] = [rule.test];
           }
           var inputElements = formElement.querySelectorAll(rule.selector);
           Array.from(inputElements).forEach (function (inputElement) {
                //Xứ lí trường hợp blur khỏi input
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }
                //xứ lí người dùng đang nhập vào input
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
                } 
           })
        })
    }
}
//Định nghĩa rules
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : message||'This is a required field';
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message||'Email address is invalid';
        }
    }
}

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message||`Password must has at least ${min} characters`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : 'Confirmation password is not correct';
        }
    }
}