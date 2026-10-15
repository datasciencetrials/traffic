import React from 'react';
import DataCaptureTab from './DataCaptureTab';

const availableSchemas = [
  {
    "title": "Axle Load Data Collection Form(1)",
    "type": "object",
    "properties": {
      "road_link_": {
        "type": "string",
        "title": "ROAD LINK: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.\u2026\u2026..\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026",
        "description": "Enter the specified ROAD LINK: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.\u2026\u2026..\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026."
      },
      "date_": {
        "type": "number",
        "title": "DATE: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.....\u2026.\u2026\u2026\u2026\u2026\u2026\u2026..",
        "description": "Numeric value required for DATE: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.....\u2026.\u2026\u2026\u2026\u2026\u2026\u2026..."
      },
      "sheet_no_": {
        "type": "string",
        "title": "SHEET NO.: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026...\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "axle_load_survey": {
        "type": "number",
        "title": "AXLE LOAD SURVEY",
        "description": "Numeric value required for AXLE LOAD SURVEY."
      }
    }
  },
  {
    "title": "Axle Load Data Collection Form",
    "type": "object",
    "properties": {
      "day": {
        "type": "string",
        "title": "Day:",
        "description": "Enter the specified Day:."
      },
      "date____________": {
        "type": "number",
        "title": "Date: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.",
        "description": "Numeric value required for Date: \u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.."
      },
      "job_no": {
        "type": "string",
        "title": "Job No:\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026..",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "day_no123": {
        "type": "string",
        "title": "Day No(1,2,3)",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "link_name": {
        "type": "string",
        "title": "Link Name:\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.",
        "description": "Enter the specified Link Name:\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026.."
      },
      "night": {
        "type": "string",
        "title": "Night:",
        "description": "Enter the specified Night:."
      }
    }
  },
  {
    "title": "Axle Load Survey Form 2026 Copy",
    "type": "object",
    "properties": {
      "date________________________": {
        "type": "number",
        "title": "Date:",
        "description": "Numeric value required for Date:."
      },
      "axle_number": {
        "type": "number",
        "title": "AXLE NUMBER",
        "description": "Numeric value required for AXLE NUMBER."
      },
      "surveyed_by": {
        "type": "string",
        "title": "Surveyed By:",
        "description": "Enter the specified Surveyed By:."
      },
      "day_no_12________________": {
        "type": "string",
        "title": "Day No. (1,2..):",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "station": {
        "type": "string",
        "title": "Station:",
        "description": "Enter the specified Station:."
      },
      "direction______________________": {
        "type": "string",
        "title": "Direction:",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "sheet_no_____________________": {
        "type": "string",
        "title": "Sheet No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "road_link": {
        "type": "string",
        "title": "ROAD LINK",
        "description": "Enter the specified ROAD LINK."
      },
      "vehicle_model": {
        "type": "string",
        "title": "Vehicle Model",
        "description": "Enter the specified Vehicle Model."
      },
      "origin_town": {
        "type": "string",
        "title": "Origin Town",
        "description": "Enter the specified Origin Town."
      },
      "axle_configuration": {
        "type": "number",
        "title": "Axle Configuration",
        "description": "Numeric value required for Axle Configuration."
      },
      "destination_town": {
        "type": "string",
        "title": "Destination Town",
        "description": "Enter the specified Destination Town."
      },
      "no": {
        "type": "string",
        "title": "No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "vehicle_type": {
        "type": "string",
        "title": "Vehicle Type",
        "description": "Enter the specified Vehicle Type."
      },
      "comments": {
        "type": "string",
        "title": "Comments",
        "description": "Enter the specified Comments."
      },
      "axle_load_survey_form": {
        "type": "number",
        "title": "AXLE LOAD SURVEY FORM",
        "description": "Numeric value required for AXLE LOAD SURVEY FORM."
      },
      "night": {
        "type": "string",
        "title": "Night",
        "description": "Enter the specified Night."
      },
      "ministry_of_works_and_transport": {
        "type": "string",
        "title": "MINISTRY OF WORKS AND TRANSPORT",
        "description": "Enter the specified MINISTRY OF WORKS AND TRANSPORT."
      },
      "plate_number": {
        "type": "string",
        "title": "Plate Number",
        "description": "Enter the specified Plate Number."
      },
      "day__________________________": {
        "type": "string",
        "title": "Day:",
        "description": "Enter the specified Day:."
      },
      "day": {
        "type": "string",
        "title": "Day",
        "description": "Enter the specified Day."
      }
    }
  },
  {
    "title": "Axle Load Survey Form",
    "type": "object",
    "properties": {
      "date________________________": {
        "type": "number",
        "title": "Date:",
        "description": "Numeric value required for Date:."
      },
      "axle_number": {
        "type": "number",
        "title": "AXLE NUMBER",
        "description": "Numeric value required for AXLE NUMBER."
      },
      "surveyed_by": {
        "type": "string",
        "title": "Surveyed By:",
        "description": "Enter the specified Surveyed By:."
      },
      "day_no_12________________": {
        "type": "string",
        "title": "Day No. (1,2..):",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "station": {
        "type": "string",
        "title": "Station:",
        "description": "Enter the specified Station:."
      },
      "direction______________________": {
        "type": "string",
        "title": "Direction:",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "sheet_no_____________________": {
        "type": "string",
        "title": "Sheet No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "road_link": {
        "type": "string",
        "title": "ROAD LINK",
        "description": "Enter the specified ROAD LINK."
      },
      "vehicle_model": {
        "type": "string",
        "title": "Vehicle Model",
        "description": "Enter the specified Vehicle Model."
      },
      "origin_town": {
        "type": "string",
        "title": "Origin Town",
        "description": "Enter the specified Origin Town."
      },
      "axle_configuration": {
        "type": "number",
        "title": "Axle Configuration",
        "description": "Numeric value required for Axle Configuration."
      },
      "destination_town": {
        "type": "string",
        "title": "Destination Town",
        "description": "Enter the specified Destination Town."
      },
      "no": {
        "type": "string",
        "title": "No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "vehicle_type": {
        "type": "string",
        "title": "Vehicle Type",
        "description": "Enter the specified Vehicle Type."
      },
      "comments": {
        "type": "string",
        "title": "Comments",
        "description": "Enter the specified Comments."
      },
      "axle_load_survey_form": {
        "type": "number",
        "title": "AXLE LOAD SURVEY FORM",
        "description": "Numeric value required for AXLE LOAD SURVEY FORM."
      },
      "night": {
        "type": "string",
        "title": "Night",
        "description": "Enter the specified Night."
      },
      "ministry_of_works_and_transport": {
        "type": "string",
        "title": "MINISTRY OF WORKS AND TRANSPORT",
        "description": "Enter the specified MINISTRY OF WORKS AND TRANSPORT."
      },
      "plate_number": {
        "type": "string",
        "title": "Plate Number",
        "description": "Enter the specified Plate Number."
      },
      "day__________________________": {
        "type": "string",
        "title": "Day:",
        "description": "Enter the specified Day:."
      },
      "day": {
        "type": "string",
        "title": "Day",
        "description": "Enter the specified Day."
      }
    }
  },
  {
    "title": "Axle Load Survey Form 2026",
    "type": "object",
    "properties": {
      "date________________________": {
        "type": "number",
        "title": "Date:",
        "description": "Numeric value required for Date:."
      },
      "axle_number": {
        "type": "number",
        "title": "AXLE NUMBER",
        "description": "Numeric value required for AXLE NUMBER."
      },
      "surveyed_by": {
        "type": "string",
        "title": "Surveyed By:",
        "description": "Enter the specified Surveyed By:."
      },
      "day_no_12________________": {
        "type": "string",
        "title": "Day No. (1,2..):",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "station": {
        "type": "string",
        "title": "Station:",
        "description": "Enter the specified Station:."
      },
      "direction______________________": {
        "type": "string",
        "title": "Direction:",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "sheet_no_____________________": {
        "type": "string",
        "title": "Sheet No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "road_link": {
        "type": "string",
        "title": "ROAD LINK",
        "description": "Enter the specified ROAD LINK."
      },
      "vehicle_model": {
        "type": "string",
        "title": "Vehicle Model",
        "description": "Enter the specified Vehicle Model."
      },
      "origin_town": {
        "type": "string",
        "title": "Origin Town",
        "description": "Enter the specified Origin Town."
      },
      "axle_configuration": {
        "type": "number",
        "title": "Axle Configuration",
        "description": "Numeric value required for Axle Configuration."
      },
      "destination_town": {
        "type": "string",
        "title": "Destination Town",
        "description": "Enter the specified Destination Town."
      },
      "no": {
        "type": "string",
        "title": "No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "vehicle_type": {
        "type": "string",
        "title": "Vehicle Type",
        "description": "Enter the specified Vehicle Type."
      },
      "comments": {
        "type": "string",
        "title": "Comments",
        "description": "Enter the specified Comments."
      },
      "axle_load_survey_form": {
        "type": "number",
        "title": "AXLE LOAD SURVEY FORM",
        "description": "Numeric value required for AXLE LOAD SURVEY FORM."
      },
      "night": {
        "type": "string",
        "title": "Night",
        "description": "Enter the specified Night."
      },
      "ministry_of_works_and_transport": {
        "type": "string",
        "title": "MINISTRY OF WORKS AND TRANSPORT",
        "description": "Enter the specified MINISTRY OF WORKS AND TRANSPORT."
      },
      "plate_number": {
        "type": "string",
        "title": "Plate Number",
        "description": "Enter the specified Plate Number."
      },
      "day__________________________": {
        "type": "string",
        "title": "Day:",
        "description": "Enter the specified Day:."
      },
      "day": {
        "type": "string",
        "title": "Day",
        "description": "Enter the specified Day."
      }
    }
  },
  {
    "title": "Axle Load Survey Form",
    "type": "object",
    "properties": {
      "road_link": {
        "type": "string",
        "title": "ROAD LINK",
        "description": "Enter the specified ROAD LINK."
      },
      "sheet_no______": {
        "type": "string",
        "title": "Sheet No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "day": {
        "type": "string",
        "title": "Day",
        "description": "Enter the specified Day."
      },
      "surveyed_by": {
        "type": "string",
        "title": "Surveyed By:",
        "description": "Enter the specified Surveyed By:."
      },
      "axle_load_survey_form": {
        "type": "number",
        "title": "AXLE LOAD SURVEY FORM",
        "description": "Numeric value required for AXLE LOAD SURVEY FORM."
      },
      "night": {
        "type": "string",
        "title": "Night",
        "description": "Enter the specified Night."
      },
      "day_no_12________________": {
        "type": "string",
        "title": "Day No. (1,2..):",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "uganda_national_roads_authority": {
        "type": "string",
        "title": "UGANDA NATIONAL ROADS AUTHORITY",
        "description": "Enter the specified UGANDA NATIONAL ROADS AUTHORITY."
      },
      "day__________________________": {
        "type": "string",
        "title": "Day:",
        "description": "Enter the specified Day:."
      },
      "date__________": {
        "type": "number",
        "title": "Date",
        "description": "Numeric value required for Date."
      },
      "station": {
        "type": "string",
        "title": "Station:",
        "description": "Enter the specified Station:."
      },
      "direction______________________": {
        "type": "string",
        "title": "Direction:",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      }
    }
  },
  {
    "title": "OD Survey Form",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "surveyor": {
        "type": "string",
        "title": "SURVEYOR:",
        "description": "Enter the specified SURVEYOR:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      }
    }
  },
  {
    "title": "OD Survey Form 300317 (1)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "surveyor": {
        "type": "string",
        "title": "SURVEYOR:",
        "description": "Enter the specified SURVEYOR:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      }
    }
  },
  {
    "title": "OD Survey Form (hoima Kyenjojo)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "kyenjojo": {
        "type": "string",
        "title": "KYENJOJO",
        "description": "Enter the specified KYENJOJO."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "hoima_-_kyenjojo_road": {
        "type": "string",
        "title": "HOIMA KYENJOJO ROAD",
        "description": "Enter the specified HOIMA KYENJOJO ROAD."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      }
    }
  },
  {
    "title": "OD Survey Form (hoima Kyenjojo)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "kyenjojo": {
        "type": "string",
        "title": "KYENJOJO",
        "description": "Enter the specified KYENJOJO."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "hoima_-_kyenjojo_road": {
        "type": "string",
        "title": "HOIMA KYENJOJO ROAD",
        "description": "Enter the specified HOIMA KYENJOJO ROAD."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      }
    }
  },
  {
    "title": "OD Survey Form (hoima Masindi)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "masindi": {
        "type": "string",
        "title": "MASINDI",
        "description": "Enter the specified MASINDI."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "hoima_-_masindi_road": {
        "type": "string",
        "title": "HOIMA MASINDI ROAD",
        "description": "Enter the specified HOIMA MASINDI ROAD."
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      }
    }
  },
  {
    "title": "OD Survey Form (hoima Masindi)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "masindi": {
        "type": "string",
        "title": "MASINDI",
        "description": "Enter the specified MASINDI."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "hoima_-_masindi_road": {
        "type": "string",
        "title": "HOIMA MASINDI ROAD",
        "description": "Enter the specified HOIMA MASINDI ROAD."
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      }
    }
  },
  {
    "title": "OD Survey Form (kampala Hoima)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "kampala_-_hoima_road": {
        "type": "string",
        "title": "KAMPALA HOIMA ROAD",
        "description": "Enter the specified KAMPALA HOIMA ROAD."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      },
      "kampala": {
        "type": "string",
        "title": "KAMPALA",
        "description": "Enter the specified KAMPALA."
      }
    }
  },
  {
    "title": "OD Survey Form (kampala Hoima)",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "kampala_-_hoima_road": {
        "type": "string",
        "title": "KAMPALA HOIMA ROAD",
        "description": "Enter the specified KAMPALA HOIMA ROAD."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "to": {
        "type": "string",
        "title": "TO:",
        "description": "Enter the specified TO:."
      },
      "night_count": {
        "type": "number",
        "title": "NIGHT COUNT",
        "description": "Numeric value required for NIGHT COUNT."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "from": {
        "type": "string",
        "title": "FROM:",
        "description": "Enter the specified FROM:."
      },
      "hoima": {
        "type": "string",
        "title": "HOIMA",
        "description": "Enter the specified HOIMA."
      },
      "kampala": {
        "type": "string",
        "title": "KAMPALA",
        "description": "Enter the specified KAMPALA."
      }
    }
  },
  {
    "title": "OD Survey Form",
    "type": "object",
    "properties": {
      "station": {
        "type": "string",
        "title": "STATION:",
        "description": "Enter the specified STATION:."
      },
      "vehicle_origin_and_destination_survey_form": {
        "type": "string",
        "title": "VEHICLE ORIGIN AND DESTINATION SURVEY FORM",
        "description": "Enter the specified VEHICLE ORIGIN AND DESTINATION SURVEY FORM."
      },
      "date": {
        "type": "number",
        "title": "DATE:",
        "description": "Numeric value required for DATE:."
      },
      "day": {
        "type": "string",
        "title": "DAY:",
        "description": "Enter the specified DAY:."
      },
      "surveyor": {
        "type": "string",
        "title": "SURVEYOR:",
        "description": "Enter the specified SURVEYOR:."
      },
      "direction": {
        "type": "string",
        "title": "DIRECTION",
        "description": "Direction 1 (Forward/Increasing) or Direction 2 (Reverse/Decreasing).",
        "enum": [
          "Direction 1",
          "Direction 2"
        ]
      },
      "link_name": {
        "type": "string",
        "title": "LINK NAME:",
        "description": "Enter the specified LINK NAME:."
      }
    }
  },
  {
    "title": "ATC All Days Survey Data Formula Workbook",
    "type": "object",
    "properties": {
      "total_volume": {
        "type": "number",
        "title": "Total Volume",
        "description": "Numeric value required for Total Volume."
      },
      "atc_traffic_count_dashboard": {
        "type": "number",
        "title": "ATC Traffic Count Dashboard",
        "description": "Numeric value required for ATC Traffic Count Dashboard."
      }
    }
  },
  {
    "title": "Masindi Municipal Councl Road Inventory Traffic Condition Data Form",
    "type": "object",
    "properties": {
      "road_length_km": {
        "type": "number",
        "title": "Road Length (km)",
        "description": "Numeric value required for Road Length (km)."
      },
      "terrain": {
        "type": "string",
        "title": "Terrain",
        "description": "Enter the specified Terrain."
      },
      "masindi_municipal_council_urban__road_condition_traffic_data": {
        "type": "string",
        "title": "MASINDI MUNICIPAL COUNCIL URBAN ROAD CONDITION TRAFFIC DATA",
        "description": "Enter the specified MASINDI MUNICIPAL COUNCIL URBAN ROAD CONDITION TRAFFIC DATA."
      },
      "road_class": {
        "type": "string",
        "title": "Road Class",
        "description": "Enter the specified Road Class."
      },
      "current_drainage": {
        "type": "string",
        "title": "Current Drainage",
        "description": "Enter the specified Current Drainage."
      },
      "traffic_data_aadt": {
        "type": "string",
        "title": "Traffic Data (AADT)",
        "description": "Enter the specified Traffic Data (AADT)."
      },
      "10-50": {
        "type": "string",
        "title": "10 50",
        "description": "Enter the specified 10 50."
      },
      "road_condition": {
        "type": "string",
        "title": "Road Condition",
        "description": "Enter the specified Road Condition."
      },
      "road_number": {
        "type": "string",
        "title": "Road Number",
        "description": "Enter the specified Road Number."
      },
      "road_name": {
        "type": "string",
        "title": "Road Name",
        "description": "Enter the specified Road Name."
      },
      "iii": {
        "type": "string",
        "title": "III",
        "description": "Enter the specified III."
      },
      "flat": {
        "type": "string",
        "title": "Flat",
        "description": "Enter the specified Flat."
      },
      "item_no": {
        "type": "string",
        "title": "Item No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "good": {
        "type": "string",
        "title": "Good",
        "description": "Enter the specified Good."
      },
      "rwebikohi_road": {
        "type": "string",
        "title": "Rwebikohi Road",
        "description": "Enter the specified Rwebikohi Road."
      },
      "central_division": {
        "type": "string",
        "title": "CENTRAL DIVISION",
        "description": "Enter the specified CENTRAL DIVISION."
      }
    }
  },
  {
    "title": "Masindi Municipal Councl Road Inventory Traffic Condition Data Form",
    "type": "object",
    "properties": {
      "road_length_km": {
        "type": "number",
        "title": "Road Length (km)",
        "description": "Numeric value required for Road Length (km)."
      },
      "terrain": {
        "type": "string",
        "title": "Terrain",
        "description": "Enter the specified Terrain."
      },
      "masindi_municipal_council_urban__road_condition_traffic_data": {
        "type": "string",
        "title": "MASINDI MUNICIPAL COUNCIL URBAN ROAD CONDITION TRAFFIC DATA",
        "description": "Enter the specified MASINDI MUNICIPAL COUNCIL URBAN ROAD CONDITION TRAFFIC DATA."
      },
      "road_class": {
        "type": "string",
        "title": "Road Class",
        "description": "Enter the specified Road Class."
      },
      "current_drainage": {
        "type": "string",
        "title": "Current Drainage",
        "description": "Enter the specified Current Drainage."
      },
      "traffic_data_aadt": {
        "type": "string",
        "title": "Traffic Data (AADT)",
        "description": "Enter the specified Traffic Data (AADT)."
      },
      "10-50": {
        "type": "string",
        "title": "10 50",
        "description": "Enter the specified 10 50."
      },
      "road_condition": {
        "type": "string",
        "title": "Road Condition",
        "description": "Enter the specified Road Condition."
      },
      "road_number": {
        "type": "string",
        "title": "Road Number",
        "description": "Enter the specified Road Number."
      },
      "road_name": {
        "type": "string",
        "title": "Road Name",
        "description": "Enter the specified Road Name."
      },
      "iii": {
        "type": "string",
        "title": "III",
        "description": "Enter the specified III."
      },
      "flat": {
        "type": "string",
        "title": "Flat",
        "description": "Enter the specified Flat."
      },
      "item_no": {
        "type": "string",
        "title": "Item No.",
        "description": "Select Yes or No.",
        "enum": [
          "Yes",
          "No",
          "N/A"
        ]
      },
      "good": {
        "type": "string",
        "title": "Good",
        "description": "Enter the specified Good."
      },
      "rwebikohi_road": {
        "type": "string",
        "title": "Rwebikohi Road",
        "description": "Enter the specified Rwebikohi Road."
      },
      "central_division": {
        "type": "string",
        "title": "CENTRAL DIVISION",
        "description": "Enter the specified CENTRAL DIVISION."
      }
    }
  }
];

export default function DataCaptureWrapper() {
    return <DataCaptureTab schemas={availableSchemas} />;
}
