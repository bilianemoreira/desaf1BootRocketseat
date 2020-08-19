const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


//GET
app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title 
  ? repositories.filter(repo => repo.title === title) 
  : repositories;

  return response.json(results);
});


//POST1
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), likes: 0, techs, title, url };
  
  repositories.push(repository);

  return response.json(repository);
});


//PUT
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) { 
      return response.status(400).json({ error: 'Repository not found'});
  }
  
  const { likes } = repositories[repositoryIndex]

  const repository = {
      id, 
      title,
      url,
      techs,
      likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});


//DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repo => repo.id === id);
     
    if (repositoryIndex < 0) { 
        return response.status(400).json({ error: 'Project not found'});
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});


//POST2
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  if (repositoryIndex < 0) { 
    return response.status(400).json({ error: 'Repository not found'});
  }

  const { likes } = repositories[repositoryIndex];
  
  const repository = { ...repositories[repositoryIndex], likes: likes + 1 };
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
