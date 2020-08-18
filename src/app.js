const express = require("express");
const cors = require("cors");

 const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
  ? repositories.filter(repositorie => repositorie.title === title) 
  : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

    const repositorie = { id: uuid(), likes: 0, techs, title, url };
    
    repositories.push(repositorie);

    return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

    if (repositorieIndex < 0) { 
        return response.status(400).json({ error: 'Project not found'});
    }
    
    const { likes } = repositories[repositorieIndex]

    const repositorie = {
        id, 
        title,
        url,
        techs,
        likes
    };

    repositories[repositorieIndex] = repositorie;

    return response.json(repositorie);
});


app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
     
    if (repositorieIndex < 0) { 
        return response.status(400).json({ error: 'Project not found'});
    }
    repositories.splice(repositorieIndex, 1);

    return response.status(204).send();
});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repo => repo.id === id);
  if (repositorieIndex < 0) { 
    return response.status(400).json({ error: 'Project not found'});
  }

  const { likes } = repositories[repositorieIndex];
  
  const repositorie = { ...repositories[repositorieIndex], likes: likes + 1 };
  
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
