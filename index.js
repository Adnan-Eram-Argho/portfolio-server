const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://adnaneramargho:4v0Dbg1iwv2odMny@cluster0.gmafofw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let projectsCollection; // Declare projectsCollection here

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const projectDb = client.db("projectDb");
    projectsCollection = projectDb.collection("projectsCollection");

    console.log("Collection initialized:", projectsCollection.collectionName);

    // Project routes
    app.post('/project', async (req, res) => {
      try {
        const projectData = req.body;
        const result = await projectsCollection.insertOne(projectData);
        res.send(result);
      } catch (error) {
        console.error("Error inserting project data:", error);
        res.status(500).send("Error inserting project data");
      }
    });

    app.get('/project', async (req, res) => {
      try {
        const projectsData = await projectsCollection.find().toArray();
        res.send(projectsData);
      } catch (error) {
        console.error("Error fetching projects data:", error);
        res.status(500).send("Error fetching projects data");
      }
    });

    app.get('/project/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
        if (project) {
          res.send(project);
        } else {
          res.status(404).send("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        res.status(500).send("Error fetching project data");
      }
    });

    // PATCH method for editing a project
    app.patch('/project/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await projectsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        if (result.matchedCount > 0) {
          res.send(result);
        } else {
          res.status(404).send("Project not found");
        }
      } catch (error) {
        console.error("Error updating project data:", error);
        res.status(500).send("Error updating project data");
      }
    });
    
        // DELETE method for deleting a project
        app.delete('/project/:id', async (req, res) => {
            try {
              const id = req.params.id;
              const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
              if (result.deletedCount > 0) {
                res.send(result);
              } else {
                res.status(404).send("Project not found");
              }
            } catch (error) {
              console.error("Error deleting project data:", error);
              res.status(500).send("Error deleting project data");
            }
          });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error during MongoDB connection and setup:", err);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('route is working');
});

app.listen(port, () => {
  console.log('App is listening on port:', port);
});
