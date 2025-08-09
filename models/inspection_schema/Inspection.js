// Directory: models/inspection/Inspection.js
import mongoose from "mongoose";
import BodyPanelSchema from "./schemas/BodyPanelSchema.js";
import GlassPanelSchema from "./schemas/GlassPanel.js";
import RubberPanelSchema from "./schemas/RubberPanel.js";
import SeatSchema from "./schemas/SeatSchema.js";
import FeatureSchema from "./schemas/FeatureSchema.js";
import TyreSchema from "./schemas/TyreSchema.js"; // Assuming TyreSchema is defined in a similar way


const InspectionSchema = new mongoose.Schema({
  vinNumber: String,
  engineNumber: String,
  odo: Number,
  keys: Number,

  bodyPanels: [BodyPanelSchema],
  glassPanels: [GlassPanelSchema],
  rubberPanels: [RubberPanelSchema],
  seatsAndFabrics: [SeatSchema],
  seatBelts: [SeatSchema],
  plasticPanels: [SeatSchema],

  features: [FeatureSchema],

  fluidLevels: {
    coolant: Boolean,
    engineOil: Boolean,
    brakeOil: Boolean,
    washerFluid: Boolean
  },

  tyres: [TyreSchema],

  engine: String,
  transmission: String,
  brakes: String,
  diagnosticCodes: String,

  liveParameters: {
    engineLoad: Number,
    idleRPM: Number,
    batteryVoltage: Number,
    distanceSinceCodeClear: Number,
    distanceInCurrentLockBlock: Number
  }
});

export default mongoose.model("InspectionSchema", InspectionSchema);

// export default InspectionSchema;