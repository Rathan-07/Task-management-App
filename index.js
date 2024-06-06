require('dotenv').config();
const express = require('express')
const ConfigureDB = require('./config/db')
const { checkSchema} = require('express-validator')
const app = express()
const cors  = require('cors')
app.use("/files",express.static("files"))
ConfigureDB()
const port = 3070
// multer
const multer  = require('multer')
const upload = multer({ dest: 'files/' })
const Pdf  = require('./app/models/pdfDetails')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,"./files")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  app.post('/upload-files', upload.single('file'), async (req, res, next) => {
    console.log(req.file);
    // Handle file upload logic
    const title = req.body.title
    const fileName = req.file.filename
    try{
        const pdf = await Pdf.create({title:title,pdf:fileName})
        // res.json(pdf)
        res.json(pdf)
    }
    catch(error){
        res.json({status:error})
    }


  });

  app.get("/get-files", async (req, res) => {
    try {
      const pdf = await Pdf.find();
      console.log(pdf);
      res.json(pdf);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", message: "Something went wrong" });
    }
  });
  


const userCltr = require('./app/controlller/user-cltr')
const taskCltr = require('./app/controlller/Task-Cltr')
const commentCltr = require('./app/controlller/comment-controller')
const authenticationUser = require('./app/middleware/authenicationUser')
const authorizedUser = require('./app/middleware/authorizedUser')
const userRegisterValidationSchema = require('./app/validations/user-register-validations')
const UserLoginValidationSchema = require('./app/validations/user-login-validations')
const {taskValidationSchema,taskEditValidationSchema } = require('./app/validations/Task-validatonSchema')

app.use(express.json())
app.use(cors())


// User Route

app.post('/users/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/users/login',checkSchema(UserLoginValidationSchema),userCltr.login)
app.get('/users/account',authenticationUser,userCltr.account)
app.get('/users/checkemail',userCltr.checkEmail)

app.get('/users/details',userCltr.get)
// Task route

app.post('/api/task',authenticationUser,authorizedUser(['user']),checkSchema(taskValidationSchema),taskCltr.create)


app.get('/api/task/:id',authenticationUser,authorizedUser(['user']),taskCltr.getById)
// app.put('/api/task/:id',authenticationUser,authorizedUser(['user']),checkSchema(taskEditValidationSchema),taskCltr.update)
app.put('/api/task/:id',authenticationUser,authorizedUser(['user']),checkSchema(taskEditValidationSchema),taskCltr.update)
app.put('/api/task/:id/assign/:userId', authenticationUser, authorizedUser(['user']), checkSchema(taskEditValidationSchema), taskCltr.assignTask);

app.delete('/api/task/:id',authenticationUser,authorizedUser(['user']),taskCltr.delete)


// Define API endpoints

app.get('/api/tasks', taskCltr.getAllTasks);

// Filter tasks
app.get('/api/tasks/filter', taskCltr.filterTasks);

// Search tasks
app.get('/api/tasks/search', taskCltr.searchTasks);

// comment

// app.post('api/task/:id/comments', commentCltr.createComment);

app.get('/api/comments/task/:taskId',commentCltr.getComments)

app.post('/api/comments',authenticationUser,authorizedUser(['user']),commentCltr.createComment)

app.put('/api/comments/:commentId',commentCltr.updateComment)

app.delete('/api/comments/:commentId',commentCltr.deleteComment)
app.listen(port, () => {
    console.log("Successfully connected to port no", port);
});
