import mongoose from "mongoose";
const BodyPanelSchema = new mongoose.Schema({
  bonet_paintThickness: Number,
  bonet_issue: String,
  bonet_imageUrls: [String],
  bonet_repaint: {type: Boolean, default: false},

  bumper_issue: String,
  bumper_imageUrls: [String],

  front_left_fender_paintThickness: Number,
  front_left_fender_issue: String,
  front_left_fender_repaint: {type: Boolean, default: false},
  front_left_fender_cladding: { type: Boolean, default: false },
  front_left_fender_cladding_issue: String,
  front_left_fender_cladding_imageUrls: [String],

  


});

export default BodyPanelSchema;
