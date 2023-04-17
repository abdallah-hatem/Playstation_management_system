const { dbConnect } = require("./database");
const server = require("./server");

const PORT = 8000;
async function startServer() {
  dbConnect().then(() =>
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    })
  );
}

startServer();
