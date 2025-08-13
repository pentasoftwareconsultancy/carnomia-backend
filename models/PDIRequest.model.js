import mongoose from "mongoose";

const inspectionFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  value: mongoose.Schema.Types.Mixed,
  type: { type: String },
});

const inspectionPartSchema = new mongoose.Schema({
  partName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  fields: [inspectionFieldSchema],
  imagesUrl: [{ type: String }],
});

const inspectionCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  parts: [inspectionPartSchema],
});

const requestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: { type: String },
    customerMobile: { type: String },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },

    imageUrl: { type: String },
    transmissionType: { type: String },
    fuelType: { type: String },

    dealerName: { type: String },
    address: { type: String },
    carStatus: { type: String },
    date: { type: Date, default: Date.now },
    notes: { type: String },

    bookingId: { type: String, unique: true },

    status: {
      type: String,
      enum: [
        "NEW",
        "Reject",
        "Waiting for Approval",
        "Assigned",
        "Ongoing",
        "Completed",
      ],
      default: "NEW",
    },
    engineer_id: { type: String },
    engineer_name: { type: String },
    engineer_mobile: { type: String },
    engineer_location: { type: String },
    engineer_assignedSlot: { type: String },

    inspection: [inspectionCategorySchema],

    // Basic Info
  vinNumber: String,
  vinNumber_imageUrl: String,
  engineNumber: String,
  engineNumber_imageUrl: String,
  odo: Number,
  odo_imageUrl: String,
  keys: String,
  keys_imageUrl: String,
  dealer_pdi: { type: Boolean, default: false },

  front_left_imageUrl: String,
  rear_left_imageUrl: String,
  rear_right_imageUrl: String,
  front_right_imageUrl: String,

  // 1) Body Panel
  bonnet_paintThickness: Number,
  bonnet_issue: String,
  bonnet_imageUrls: [String],
  bonnet_repaint: { type: Boolean, default: false },

  bumper_issue: String,
  bumper_imageUrls: [String],

  front_left_fender_paintThickness: Number,
  front_left_fender_issue: String,
  front_left_fender_repaint: { type: Boolean, default: false },
  front_left_fender_cladding: { type: Boolean, default: false },
  front_left_fender_cladding_issue: String,
  front_left_fender_imageUrls: [String],
  front_left_fender_cladding_imageUrls: [String],

  front_left_door_paintThickness: Number,
  front_left_door_issue: String,
  front_left_door_orvm_issue: String,
  front_left_door_cladding_issue: String,
  front_left_door_cladding: { type: Boolean, default: false },
  front_left_door_imageUrls: [String],
  front_left_door_orvm_imageUrls: [String],
  front_left_door_cladding_imageUrls: [String],

  rear_left_door_paintThickness: Number,
  rear_left_door_issue: String,
  rear_left_door_cladding_issue: String,
  rear_left_door_cladding: { type: Boolean, default: false },
  rear_left_door_imageUrls: [String],
  rear_left_door_cladding_imageUrls: [String],

  rear_left_quarter_panel_paintThickness: Number,
  rear_left_quarter_panel_issue: String,
  rear_left_quarter_panel_cladding_issue: String,
  rear_left_quarter_panel_cladding: { type: Boolean, default: false },
  rear_left_quarter_panel_imageUrls: [String],
  rear_left_quarter_panel_cladding_imageUrls: [String],

  boot_paintThickness: Number,
  boot_issue: String,
  boot_tail_light_console_left: String,
  boot_tail_light_console_right: String,

  boot_imageUrls: [String],
  boot_tail_light_console_imageUrls: [String],

  rear_bumper_issue: String,
  rear_bumper_imageUrls: [String],

  rear_right_quarter_panel_paintThickness: Number,
  rear_right_quarter_panel_issue: String,
  rear_right_quarter_panel_cladding_issue: String,
  rear_right_quarter_panel_cladding: { type: Boolean, default: false },
  rear_right_quarter_panel_imageUrls: [String],
  rear_right_quarter_panel_cladding_imageUrls: [String],

  rear_right_door_paintThickness: Number,
  rear_right_door_issue: String,
  rear_right_door_cladding_issue: String,
  rear_right_door_cladding: { type: Boolean, default: false },
  rear_right_door_imageUrls: [String],
  rear_right_door_cladding_imageUrls: [String],

  front_right_door_paintThickness: Number,
  front_right_door_issue: String,
  front_right_door_orvm_issue: String,
  front_right_door_cladding_issue: String,
  front_right_door_cladding: { type: Boolean, default: false },
  front_right_door_imageUrls: [String],
  front_right_door_orvm_imageUrls: [String],
  front_right_door_cladding_imageUrls: [String],

  front_right_fender_paintThickness: Number,
  front_right_fender_issue: String,
  front_right_fender_cladding_issue: String,
  front_right_fender_cladding: { type: Boolean, default: false },
  front_right_fender_imageUrls: [String],
  front_right_fender_cladding_imageUrls: [String],

  roof_paintThickness: Number,
  roof_issue: String,
  roof_imageUrls: [String],

  // 2) Glass Panels
  front_windshield_brand: String,
  front_windshield_manufacturingDate: String,
  front_windshield_issues: String,
  front_windshield_imageUrls: [String],

  front_left_door_glass_brand: String,
  front_left_door_glass_manufacturingDate: String,
  front_left_door_glass_issues: String,
  front_left_door_glass_imageUrls: [String],

  left_side_orvm_issues: String,
  left_side_orvm_imageUrls: [String],

  rear_left_door_glass_brand: String,
  rear_left_door_glass_manufacturingDate: String,
  rear_left_door_glass_issues: String,
  rear_left_door_glass_imageUrls: [String],

  rear_left_quarter_glass_brand: String,
  rear_left_quarter_glass_manufacturingDate: String,
  rear_left_quarter_glass_issues: String,
  rear_left_quarter_glass_imageUrls: [String],

  rear_windshield_brand: String,
  rear_windshield_manufacturingDate: String,
  rear_windshield_issues: String,
  rear_windshield_imageUrls: [String],

  rear_right_quarter_glass_brand: String,
  rear_right_quarter_glass_manufacturingDate: String,
  rear_right_quarter_glass_issues: String,
  rear_right_quarter_glass_imageUrls: [String],

  rear_right_door_glass_brand: String,
  rear_right_door_glass_manufacturingDate: String,
  rear_right_door_glass_issues: String,
  rear_right_door_glass_imageUrls: [String],

  front_right_door_glass_brand: String,
  front_right_door_glass_manufacturingDate: String,
  front_right_door_glass_issues: String,
  front_right_door_glass_imageUrls: [String],

  right_side_orvm_issues: String,
  right_side_orvm_imageUrls: [String],

  sunroof_glass_brand: String,
  sunroof_glass_manufacturingDate: String,
  sunroof_glass_issues: String,
  sunroof_glass_imageUrls: [String],

  // 3) Rubber Panels
  rubber_bonnet_issues: String,
  rubber_bonnet_imageUrls: [String],
  rubber_front_left_door_issues: String,
  rubber_front_left_door_imageUrls: [String],
  rubber_rear_left_door_issues: String,
  rubber_rear_left_door_imageUrls: [String],
  rubber_boot_issues: String,
  rubber_boot_imageUrls: [String],
  rubber_rear_right_door_issues: String,
  rubber_rear_right_door_imageUrls: [String],
  rubber_front_right_door_issues: String,
  rubber_front_right_door_imageUrls: [String],
  rubber_front_wiper_issues: String,
  rubber_front_wiper_imageUrls: [String],
  rubber_rear_wiper_toggle:{ type: Boolean, default: false },
  rubber_rear_wiper_issues: String,
  rubber_rear_wiper_imageUrls: [String],
  rubber_sunroof_issues: String,
  rubber_sunroof_imageUrls: [String],

  // 4) Seats & Fabrics
  seat_driver_issues: String,
  seat_driver_imageUrls: [String],
  seat_driver_head_rest_issues: String,
  seat_driver_head_rest_imageUrls: [String],
  seat_codriver_issues: String,
  seat_codriver_imageUrls: [String],
  seat_codriver_head_rest_issues: String,
  seat_codriver_head_rest_imageUrls: [String],
  seat_rear_issues: String,
  seat_rear_imageUrls: [String],
  seat_rear_head_rest_issues: String,
  seat_rear_head_rest_imageUrls: [String],
  seat_third_row_toggle:{ type: Boolean, default: false },
  seat_third_row_issues: String,
  seat_third_row_imageUrls: [String],
  seat_third_row_head_rest_issues: String,
  seat_third_row_head_rest_imageUrls: [String],
  seat_roof_issues: String,
  seat_roof_imageUrls: [String],
  seat_sunroof_issues: String,
  seat_sunroof_imageUrls: [String],

  // 5) Seat Belts
  seatbelt_driver_issues: String,
  seatbelt_driver_imageUrls: [String],
  seatbelt_codriver_issues: String,
  seatbelt_codriver_imageUrls: [String],
  seatbelt_rear_left_passenger_issues: String,
  seatbelt_rear_left_passenger_imageUrls: [String],
  seatbelt_rear_right_passenger_issues: String,
  seatbelt_rear_right_passenger_imageUrls: [String],
  seatbelt_third_row_toggle:{ type: Boolean, default: false },
  seatbelt_third_row_issues: String,
  seatbelt_third_row_imageUrls: [String],

  // 6) Plastic Panels
  plastic_driver_door_issues: String,
  plastic_driver_door_imageUrls: [String],
  plastic_codriver_door_issues: String,
  plastic_codriver_door_imageUrls: [String],
  plastic_rear_left_passenger_door_issues: String,
  plastic_rear_left_passenger_door_imageUrls: [String],
  plastic_rear_right_passenger_door_issues: String,
  plastic_rear_right_passenger_door_imageUrls: [String],
  plastic_third_row_toggle:{ type: Boolean, default: false },
  plastic_third_row_issues: String,
  plastic_third_row_imageUrls: [String],
  plastic_dashboard_issues: String,
  plastic_dashboard_imageUrls: [String],
  plastic_gear_console_issues: String,
  plastic_gear_console_imageUrls: [String],
  plastic_steering_issues: String,
  plastic_steering_imageUrls: [String],
  plastic_ac_vents_issues: String,
  plastic_ac_vents_imageUrls: [String],
  plastic_rear_ac_vents_issues: String,
  plastic_rear_ac_vents_imageUrls: [String],
  plastic_irvm_issues: String,
  plastic_irvm_imageUrls: [String],

  // 7) Features & Functions
  feature_parking_sensors_front_available: { type: Boolean, default: true },      // Default true as available
  feature_parking_sensors_front_issueObserved: { type: Boolean, default: false }, // Default false as no issue observed

  feature_parking_sensors_rear_available: { type: Boolean, default: true },
  feature_parking_sensors_rear_issueObserved: { type: Boolean, default: false },

  feature_front_view_camera_available: { type: Boolean, default: true },
  feature_front_view_camera_issueObserved: { type: Boolean, default: false },

  feature_rear_view_camera_available: { type: Boolean, default: true },
  feature_rear_view_camera_issueObserved: { type: Boolean, default: false },

  feature_camera_360_available: { type: Boolean, default: true },
  feature_camera_360_issueObserved: { type: Boolean, default: false },

  feature_touch_screen_available: { type: Boolean, default: true },
  feature_touch_screen_issueObserved: { type: Boolean, default: false },

  feature_speakers_available: { type: Boolean, default: true },
  feature_speakers_issueObserved: { type: Boolean, default: false },

  feature_electric_orvm_available: { type: Boolean, default: true },
  feature_electric_orvm_issueObserved: { type: Boolean, default: false },

  feature_auto_dimming_irvm_available: { type: Boolean, default: true },
  feature_auto_dimming_irvm_issueObserved: { type: Boolean, default: false },

  feature_ventilated_seat_driver_available: { type: Boolean, default: true },
  feature_ventilated_seat_driver_issueObserved: { type: Boolean, default: false },

  feature_ventilated_seat_codriver_available: { type: Boolean, default: true },
  feature_ventilated_seat_codriver_issueObserved: { type: Boolean, default: false },

  feature_ventilated_seat_rear_available: { type: Boolean, default: true },
  feature_ventilated_seat_rear_issueObserved: { type: Boolean, default: false },


  // 8) Live Parameters
  live_engine_load_toggle:{ type: Boolean, default: false },
  live_engine_load: Number,
  live_idle_rpm_toggle:{ type: Boolean, default: false },
  live_idle_rpm: Number,
  live_battery_voltage: Number,
  live_distance_since_code_clear: Number,
  live_distance_in_current_lock_block: Number,

  // 9) Fluid Levels
  fluid_coolant_withinRange: { type: Boolean, default: false },
  fluid_coolant_contamination: { type: Boolean, default: false },

  fluid_engineOil_withinRange: { type: Boolean, default: false },
  fluid_engineOil_contamination: { type: Boolean, default: false },

  fluid_brakeOil_withinRange: { type: Boolean, default: false },
  fluid_brakeOil_contamination: { type: Boolean, default: false },

  fluid_washerFluid_withinRange: { type: Boolean, default: false },
  fluid_washerFluid_contamination: { type: Boolean, default: false },

  // 10) Engine
  engine_issue: String,
  
  // 11) Transmission
  transmission_issue: String,

  // 12) Brakes
  brakes_issue: String,

  // 13) Diagnostics
  diagnostic_codes: [String],


  // 14) Tyres
  tyre_front_left_brand: String,
  tyre_front_left_subBrand: String,
  tyre_front_left_variant: String,
  tyre_front_left_size: String,
  tyre_front_left_manufacturingDate: String,
  tyre_front_left_treadDepth: Number,
  tyre_front_left_issue: String,
  tyre_front_left_imageUrls: [String],

  tyre_rear_left_brand: String,
  tyre_rear_left_subBrand: String,
  tyre_rear_left_variant: String,
  tyre_rear_left_size: String,
  tyre_rear_left_manufacturingDate: String,
  tyre_rear_left_treadDepth: Number,
  tyre_rear_left_issue: String,
  tyre_rear_left_imageUrls: [String],

  tyre_rear_right_brand: String,
  tyre_rear_right_subBrand: String,
  tyre_rear_right_variant: String,
  tyre_rear_right_size: String,
  tyre_rear_right_manufacturingDate: String,
  tyre_rear_right_treadDepth: Number,
  tyre_rear_right_issue: String,
  tyre_rear_right_imageUrls: [String],

  tyre_front_right_brand: String,
  tyre_front_right_subBrand: String,
  tyre_front_right_variant: String,
  tyre_front_right_size: String,
  tyre_front_right_manufacturingDate: String,
  tyre_front_right_treadDepth: Number,
  tyre_front_right_issue: String,
  tyre_front_right_imageUrls: [String],

  tyre_spare_toggle: { type: Boolean, default: false },
  tyre_spare_brand: String,
  tyre_spare_subBrand: String,
  tyre_spare_variant: String,
  tyre_spare_size: String,
  tyre_spare_manufacturingDate: String,
  tyre_spare_treadDepth: Number,
  tyre_spare_issue: String,
  tyre_spare_imageUrls: [String],

  // 15) Other Observations
  other_observations: String,
},
  { timestamps: true }
);

export default mongoose.model("PDIRequest", requestSchema);
