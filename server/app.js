const express = require("express");
const script = require("../script/script");
const app = express();
const port = 3000;

// Express Middleware

// Get static files
app.use("/data", express.static("data"));
// Reading json from body (client)
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Succeed",
    message: "Ping successfully",
    isSuccess: true,
  });
});

// GET/ method

app.get("/api/v1/cars", async (req, res) => {
  try {
    const cars = await script.getJSON("cars.json");
    res.status(200).json({
      status: "Succeed",
      message: "Successfully obtained cars data",
      isSuccess: true,
      totalData: cars.length,
      data: {
        cars,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to obtain cars data",
      isSuccess: false,
      data: null,
    });
  }
});

// get car detail
app.get("/api/v1/cars/:id", async (req, res) => {
  const idCar = req.params.id;
  try {
    const cars = await script.getJSON("cars.json");
    // Find idCar in cars array
    const detailCar = cars.find((obj) => obj.id === idCar);
    if (!detailCar) {
      res.status(404).json({
        status: "Failed",
        message: "ID car not found",
        isSuccess: false,
        data: null,
      });
    } else {
      res.status(200).json({
        status: "Succeed",
        message: "Successfully obtained cars data",
        isSuccess: true,
        id: idCar,
        data: {
          car: detailCar,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to obtain car data",
      isSuccess: false,
      data: null,
    });
  }
});

// POST/ Method
app.post("/api/v1/cars", async (req, res) => {
  const newCar = req.body;
  try {
    let cars = await script.getJSON("cars.json");
    // Adding new car data array to cars
    newCar.forEach((car) => {
      cars.push(car);
    });
    // data must to be typeBuffer, string, etc. Not JSON
    cars = JSON.stringify(cars);
    // write content in file
    script.writeFile("./data/cars.json", cars);

    res.status(200).json({
      status: "Succeed",
      message: "Successfully added new car data",
      isSuccess: true,
      data: {
        cars: newCar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to add new cars data, make sure the body send an array",
      isSuccess: false,
      data: null,
    });
  }
});

// PUT/ Method
app.put("/api/v1/cars/:id", (req, res) => {
  const idCar = req.params.id;
});

// DELETE/ method
app.delete("/api/v1/cars/:id", async (req, res) => {
  const idCar = req.params.id;
  let deletedCar;
  try {
    const cars = await script.getJSON("cars.json");
    // Find idCar in cars array
    deletedCar = cars.find((obj) => obj.id === idCar);
    if (!deletedCar) {
      res.status(404).json({
        status: "Failed",
        message: "ID car is not found",
        isSuccess: false,
        data: null,
      });
    } else {
      // Find index of car data object
      const indexObj = cars.findIndex((obj) => obj == deletedCar);
      // Delete car data by index arrays
      cars.splice(indexObj, 1);

      script.writeFile("./data/cars.json", JSON.stringify(cars));

      res.status(200).json({
        status: "Succeed",
        message: "Successfully delete car data",
        isSuccess: true,
        id: idCar,
        data: {
          car: deletedCar,
        },
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Failed",
      message: "Failed to delete car data",
      isSuccess: false,
      data: null,
    });
  }
});

// Middleware to handle page not found
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: "Page not found",
    isSuccess: false,
  });
  // Go to the next middleware
  next();
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan pada http://localhost:${port}`);
});
