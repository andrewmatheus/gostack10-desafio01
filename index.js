const express = require('express');

const server = express();

server.use(express.json());

let countRequest = 0;
const project = [];

//Middleware Global
server.use((req, res, next) => {
  countRequest++;

  console.log(`Count Request: ${countRequest}`);

  return next();
});

//Middleware Local
function checkProjectIds(req, res, next) {
  const { id } = req.params;

  if (!checkProjectExist(id)) {
    return res.status(400).json({ error: "Project not found!" });
  };
  
  next();
};

function checkProjectExist(id) {
  const proj = project.find(proj => proj.id == id);

  if (!proj) {
    return false;
  } 
    
  return true;  
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  if (checkProjectExist(id)) {
    return res.status(400).json({ error: `Project ID: ${id}, already exists!` });
  }

  project.push({
    id,
    title,
    tasks: []
  });

  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(project);
});

server.put('/projects/:id', checkProjectIds, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const proj = project.find(proj => proj.id == id);
  
  proj.title = title;

  return res.json(proj);
});

server.delete('/projects/:id', checkProjectIds, (req, res) => {
  const { id } = req.params;

  const projIndex = project.findIndex(proj => proj.id == id);

    project.splice(projIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectIds, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projTask = project.find(proj => proj.id == id);

  projTask.tasks.push(title);

  return res.json(projTask);
});

server.listen(3000);
