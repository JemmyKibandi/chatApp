const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:5000/test") // change DB name if needed
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const result = await mongoose.connection.db.collection("messages").dropIndex("id_1");
    console.log("🧹 Dropped index:", result);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error:", err.message);
    mongoose.connection.close();
  });
