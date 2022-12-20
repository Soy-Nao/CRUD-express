const express = require('express'); // Importamos la librería Express
const path = require('path'); // Importamos la librería Path
const fs = require('fs/promises'); // Importamos la librería FS/Promises

// Creamos la aplicación de Express
const app = express();

// Usamos el middleware de JSON para parsear el cuerpo de la solicitud
app.use(express.json());

// Establecemos la ruta al archivo JSON de la lista de tareas
const jsonPath = path.resolve('./file/tasks.json');

// GET para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  // Leemos el contenido del archivo JSON de tareas
  const tasks = await fs.readFile(jsonPath, 'utf8');
  // Enviamos las tareas como respuesta
  res.send(tasks);
});

// POST para crear una nueva tarea
app.post('/tasks', async (req, res) => {
  // Obtenemos la tarea del cuerpo de la solicitud
  const task = req.body;
  // Leemos el contenido del archivo JSON de tareas
  const tasks = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  // Generamos un nuevo ID para la tarea
  const lastIndex = tasks.length - 1;
  const newId = tasks[lastIndex]?.id + 1;
  // Agregamos la tarea al array de tareas
  tasks.push({ ...task, id: newId });
  // Escribimos el array actualizado de tareas en el archivo JSON
  await fs.writeFile(jsonPath, JSON.stringify(tasks));
  // Finalizamos la respuesta
  res.send('Tarea creada');
  res.end();
});

// PUT para actualizar el estatus de una tarea
app.put('/tasks', async (req, res) => {
    // Leemos el contenido del archivo JSON de tareas
  const tasks = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  // Obtenemos el ID y el nuevo estatus del cuerpo de la solicitud
  const { id, status, title, description } = req.body;
  
  // Encontramos la tarea con el ID coincidente
  const taskIndex = tasks.findIndex(task => task.id === id);
  // Actualizamos el estatus de la tarea
  tasks[taskIndex].status = status;
  tasks[taskIndex].title = title;
  tasks[taskIndex].description = description;
  // Escribimos el array actualizado de tareas en el archivo JSON
  await fs.writeFile(jsonPath, JSON.stringify(tasks));
  // Enviamos una respuesta indicando que se ha actualizado la tarea
  res.send('Tarea actualizada');
  res.end();
});

// DELETE para eliminar una tarea
app.delete('/tasks', async (req, res) => {
    // Obtenemos el ID de la tarea a eliminar del cuerpo de la solicitud
    const { id } = req.body;
    // Leemos el contenido del archivo JSON de tareas
    const tasks = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    // Encontramos la tarea con el ID coincidente
    const taskIndex = tasks.findIndex(task => task.id === id);
    // Eliminamos la tarea del array de tareas
    tasks.splice(taskIndex, 1);
    // Escribimos el array actualizado de tareas en el archivo JSON
    await fs.writeFile(jsonPath, JSON.stringify(tasks));
    // Enviamos una respuesta indicando que se ha eliminado la tarea
    res.send('Tarea eliminada');
    res.end();
  });
  
  // Iniciamos el servidor en un puerto específico
  const PORT = 8000
  app.listen(PORT, () => {
    console.log(`API de la lista de tareas escuchando en el puerto ${PORT}`);
  });
  
