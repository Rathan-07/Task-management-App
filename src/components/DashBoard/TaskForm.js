import { useState } from "react";
import axios from "axios";
import _ from 'lodash';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskComponent from "../TaskComponent";

export default function TaskForm(){
   const {dispatch} = useAuth();
   const navigate = useNavigate();

    const [form, setForm] = useState({
        title:'',
        description:'',
        priority:'',
        status: '',
        dueDate:'',
        assignedUserId:[],
        startDate:'',
        endDate:'',

        titleErr:'',
        descriptionErr:'',
        priorityErr:'',
        statusErr:'',
        dueDateErr:'',



        serverErrors: null,
        clientErrors: {}
    });

    const runValidations = () => {
        const errors = {}; 
        if(form.title.trim().length === 0){
            errors.title = 'Title is required'; 
        }
        if(form.description.trim().length === 0){
            errors.description = 'Description is required'; 
        } 
        if(form.priority.trim().length === 0 ){
            errors.priority = 'Priority should be either High, Medium, or Low';
        }
        if(form.status.trim().length === 0){
            errors.status = 'Status field is required';
        }
        if(form.dueDate.trim().length === 0){
            errors.dueDate = 'Due date is required';
        }
        return errors; 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = _.pick(form, ['title', 'description', 'priority', 'status', 'dueDate', 'startDate', 'endDate']); 
        const errors = runValidations();
        if(Object.keys(errors).length === 0){
            try {
                const response = await axios.post('http://localhost:3070/api/task', formData, {
                    headers:{
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data)
                alert('Task Created');
                dispatch({type:'TASK', payload:response.data});
                console.log('Task ID:', response.data._id);
                navigate('/dashboard/TaskItem/' + response.data._id);

                
              
            }
            catch(error){
                // console.log(errors);
                // setForm({...form, serverErrors: errors.response.data});

                if(error.response && error.response.data && error.response.data.errors){
                    const errors = error.response.data.errors;
                    const titleError = errors.find((ele)=>ele.path === 'title')
                    const descriptionError = errors.find((ele)=>ele.path === 'description')
                    const priorityError = errors.find((ele)=>ele.path === 'priority')
                    const dueDateError = errors.find((ele)=>ele.path === 'dueDate')
                    
                    setForm({
                        ...form,
                        titleErr:titleError ? titleError.msg :'',
                        descriptionErr:descriptionError ? descriptionError.msg:'',
                        priorityErr:priorityError ? priorityError.msg:'',
                        dueDateErr:dueDateError ? dueDateError.msg:''
                    })
                
                
                
                }

                
               
            } 
        }
        else {
            console.log(errors);
            setForm({...form, clientErrors: errors});
        }
    };

    return (
        <div>
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Enter title</label><br />
                <input 
                    type="text"
                    value={form.title}
                    name="title"
                    onChange={handleChange}
                />
                {form.clientErrors['title'] && <span>{form.clientErrors['title']}</span>}
                {form.titleErr && <span>{form.titleErr}</span>}
                <br />

                <label htmlFor="description">Enter description</label><br />
                <input 
                    type="text"
                    value={form.description}
                    name="description"
                    onChange={handleChange}
                />
                {form.clientErrors['description'] && <span>{form.clientErrors['description']}</span>}
                {form.descriptionErr && <span>{form.descriptionErr}</span>}
                <br />

                <label>Priority:</label><br />
                <input 
                    type="radio"
                    id="High"
                    value="High"
                    name="priority"
                    checked={form.priority === 'High'}
                    onChange={handleChange}
                />
                <label htmlFor="High">High</label>

                <input 
                    type="radio"
                    id="Medium"
                    value="Medium"
                    name="priority"
                    checked={form.priority === 'Medium'}
                    onChange={handleChange}
                />
              
                <label htmlFor="Medium">Medium</label>

                <input 
                    type="radio"
                    id="Low"
                    value="Low"
                    name="priority"
                    checked={form.priority === 'Low'}
                    onChange={handleChange}
                />
                  {form.clientErrors['priority'] && <span>{form.clientErrors['priority']}</span>}
                {form.priorityErr && <span>{form.priorityErr}</span>}
                <label htmlFor="Low">Low</label><br />

                <label>Status:</label><br />
                <select 
                    value={form.status}
                    name="status"
                    onChange={handleChange}
                >
                    <option value="">Select Status</option>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                {form.clientErrors['status'] && <span>{form.clientErrors['status']}</span>}
                {form.statusErr && <span>{form.statusErr}</span>}
                <br />

                <label htmlFor="dueDate">Due Date:</label><br />
                <input 
                    type="date"
                    value={form.dueDate}
                    name="dueDate"
                    onChange={handleChange}
                />
                {form.clientErrors['dueDate'] && <span>{form.clientErrors['dueDate']}</span>}
                {form.dueDateErr && <span>{form.dueDateErr}</span>}
                <br />


                <label htmlFor="startDate">startDate:</label><br />
                <input 
                    type="date"
                    value={form.startDate}
                    name="startDate"
                    onChange={handleChange}
                />
                <br />
                

                <label htmlFor="endDate">endDate:</label><br />
                <input 
                    type="date"
                    value={form.endDate}
                    name="endDate"
                    onChange={handleChange}
                />
                <br />
                <TaskComponent/>
                <input type="submit" />
            </form>   


        </div>
    );
}
