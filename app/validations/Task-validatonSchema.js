const Task = require("../models/Task");

const taskValidationSchema = {

    title:{
        in:['body'],
        exists:{
            errorMessage:'Task field is required'

        },
        notEmpty:{
            errorMessage:"Task field cannot be empty"
        },
        
    },
    description:{
        in:['body'],
        exists:{
            errorMessage:'description field is req'
        },
        notEmpty:{
            errorMessage:"description field cannot be empty"
        },
        isLength:{
            options:{min:5,max:128},
            errorMessage:"description content should be in b/w (5 to 128)"
        }
    },
    priority:{
        in:['body'],
        exists:{
            errorMessage:'priority field is req'
        },
        notEmpty:{
            errorMessage:"priority field cannot be empty"
        },
        isIn:{
            options:[['High', 'Medium', 'Low']],
            errorMessage:"priority should include (high,medium,low)"
        }
    },
    status:{
        in:['body'],
        exists:{
            errorMessage:'status field is req'
        },
        notEmpty:{
            errorMessage:"status field cannot be empty"
        },
        isIn:{
            options:[ ['Todo', 'In Progress', 'Done']],
            errorMessage:"status should include (Todo,in progress,done)"
        }
    },
    dueDate:{
        in:['body'],
        exists: {
            errorMessage: 'dueDate field is req'
        },
        notEmpty: {
            errorMessage: "duedate field cannot be empty"
        },
        custom: {
            options: async function(value) {
              
                if (!Date.parse(value)) {
                    throw new Error('Invalid due date');
                }
             
                if (new Date(value) <= new Date()) {
                    throw new Error('Due date must be in the future');
                }
                return true;
            }
        }
    }
};
const taskEditValidationSchema = {

    title:{
        in:['body'],
        exists:{
            errorMessage:'Task field is required'

        },
        notEmpty:{
            errorMessage:"Task field cannot be empty"
        },
        
    },
    description:{
        in:['body'],
        exists:{
            errorMessage:'description field is req'
        },
        notEmpty:{
            errorMessage:"description field cannot be empty"
        },
        isLength:{
            options:{min:5,max:128},
            errorMessage:"description content should be in b/w (5 to 128)"
        }
    },
    priority:{
        in:['body'],
        exists:{
            errorMessage:'priority field is req'
        },
        notEmpty:{
            errorMessage:"priority field cannot be empty"
        },
        isIn:{
            options:[['High', 'Medium', 'Low']],
            errorMessage:"priority should include ('High', 'Medium', 'Low')"
        }
    },
    status:{
        in:['body'],
        exists:{
            errorMessage:'status field is req'
        },
        notEmpty:{
            errorMessage:"status field cannot be empty"
        },
        isIn:{
            options:[ ['Todo', 'In Progress', 'Done']],
            errorMessage:"status should include (Todo,in progress,done)"
        }
    },
    dueDate:{
        in:['body'],
        exists: {
            errorMessage: 'dueDate field is req'
        },
        notEmpty: {
            errorMessage: "duedate field cannot be empty"
        },
        custom: {
            options: async function(value) {
              
                if (!Date.parse(value)) {
                    throw new Error('Invalid due date');
                }
             
                if (new Date(value) <= new Date()) {
                    throw new Error('Due date must be in the future');
                }
                return true;
            }
        }
    }
};
module.exports = {taskValidationSchema,taskEditValidationSchema}
