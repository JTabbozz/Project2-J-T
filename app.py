
from typing import Type
import numpy as np
from flask_cors import CORS, cross_origin
import datetime as dt
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask_compress import Compress
from flask import Flask, jsonify, request


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///project.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Firedata = Base.classes.firedata
Rainfall1 = Base.classes.rainfall
Firehistorical = Base.classes.firehistorical
Vegetation = Base.classes.Vegetation
Fireprone = Base.classes.Fireprone
FireWAhistorical = Base.classes.fireWAhistorical

# Create our session (link) from Python to the DB
#session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["COMPRESS_REGISTER"] = False  # disable default compression of all eligible requests
compress = Compress()
compress.init_app(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/firedata<br/>"
        f"/api/v1.0/firehistorical<br/>"
        f"/api/v1.0/rainfall<br/>"
        f"/api/v1.0/Fireprone<br/>"
        f"/api/v1.0/vegetation<br/>"
        f"/api/v1.0/fireWAhistorical"
    )



@app.route("/api/v1.0/fireWAhistorical", methods=['GET'])
@cross_origin(supports_credentials=True)
def fireWAhistorical():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #"""Return a list of rain data between 1956 to 2019"""
    # Query all rain data
    results = session.query(FireWAhistorical.Year,FireWAhistorical.Season, FireWAhistorical.Cause, FireWAhistorical.Purpose,FireWAhistorical.Comment,FireWAhistorical.Area,FireWAhistorical.District,FireWAhistorical.Type).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    WAhistorical = []
    for  Year,Season, Cause, Purpose,Comment, Area, District, Type in results:
        WAhistorical_dict = {}
        WAhistorical_dict["Year"] = Year
        WAhistorical_dict["Season"] = Season
        WAhistorical_dict["Cause"] = Cause
        WAhistorical_dict["Purpose"]= Purpose
        WAhistorical_dict["Comment"] = Comment
        WAhistorical_dict["Area"] =   Area  
        WAhistorical_dict["District"] = District
        WAhistorical_dict["Type"] = Type      
        WAhistorical.append(WAhistorical_dict)
    

    return jsonify(WAhistorical)


@app.route("/api/v1.0/Fireprone")
def fireprone():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #"""Return a list of rain data between 1956 to 2019"""
    # Query all rain data
    results = session.query(Fireprone.Coordinates,Fireprone.lga, Fireprone.Designation, Fireprone.Type, Fireprone.designationdate, Fireprone.Area, Fireprone.Perimeter).all()
    
    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_lga = []
    for  Coordinates,lga, Designation, Type, designationdate,Area, Perimeter in results:
        fires_lga_dict = {}
        fires_lga_dict["Coordinates"] = Coordinates
        fires_lga_dict["lga"] = lga
        fires_lga_dict["Designation"] = Designation
        fires_lga_dict["Type"]= Type
        fires_lga_dict["designationdate"] =   designationdate
        fires_lga_dict["Area"] =   Area  
        fires_lga_dict["Perimeter"] =   Perimeter        
        all_lga.append(fires_lga_dict )

    return jsonify(all_lga)


@app.route("/api/v1.0/vegetation")
def vegetation():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #"""Return a list of rain data between 1956 to 2019"""
    # Query all rain data
    results = session.query(Vegetation.Coordinates, Vegetation.Description, Vegetation.MapUnit_id, Vegetation.Structure_description, Vegetation.System, Vegetation.Vegetation_type, Vegetation.veg_assoc,Vegetation.Area,Vegetation.Perimeter ).all()
    
    session.close()
    all_veg = []
    for Coordinates, Description, MapUnit_id , Structure_description, System,Vegetation_type,veg_assoc,Area,Perimeter in results:
        veg_dict = {}
        veg_dict["Coordinates"] = Coordinates
        veg_dict["Description"] = Description
        veg_dict["MapUnit_id "] = MapUnit_id 
        veg_dict["Structure_description"]= Structure_description
        veg_dict["System"] =   System
        veg_dict["Vegetation_type"] =   Vegetation_type
        veg_dict["veg_assoc"] =   veg_assoc
        veg_dict["Area"] =   Area  
        veg_dict["Perimeter"] =   Perimeter        
        all_veg.append(veg_dict)

    return jsonify(all_veg)






@app.route("/api/v1.0/rainfall", methods=['GET'])
@cross_origin(supports_credentials=True)
def Rainfall():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #"""Return a list of rain data between 1956 to 2019"""
    # Query all rain data
    results = session.query(Rainfall1.Year, Rainfall1.Avg_Annual_Temp, Rainfall1.Avg_Annual_Rainfall).all()
    
    session.close()
    rainfall = []
    for Year, Avg_Annual_Temp, Avg_Annual_Rainfall in results:
        rainfall_dict = {}
        rainfall_dict["Year"] = Year
        rainfall_dict["Avg_Annual_Temp"] = Avg_Annual_Temp
        rainfall_dict["Avg_Annual_Rainfall"] = Avg_Annual_Rainfall
        rainfall.append(rainfall_dict)

    # Convert list of tuples into normal list
    if request.method == 'GET':
        return jsonify(rainfall)



@app.route("/api/v1.0/firehistorical")
def firehistorical():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #"""Return a list of bushfire data including the Name, AreaBurned_ha, Fatalities, PropertiesDamaged_HomesDestroyed and Year"""
    # Query all fires
    results = session.query(Firehistorical.Name, Firehistorical.AreaBurned_ha, Firehistorical.Fatalities,Firehistorical.PropertiesDamaged_HomesDestroyed, \
        Firehistorical.Year).all()
    #filter(Firehistorical.States_territories == 'Western Australia')

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_Fires = []
    for Name, AreaBurned_ha, Fatalities, PropertiesDamaged_HomesDestroyed, Year in results:
        hfires_dict = {}
        hfires_dict["Name"] = Name
        hfires_dict["AreaBurned_ha"] = AreaBurned_ha
        hfires_dict["Fatalities"] = Fatalities
        hfires_dict["PropertiesDamaged_HomesDestroyed"]= PropertiesDamaged_HomesDestroyed
        hfires_dict["Year"] =   Year       
        all_Fires.append(hfires_dict)

    return jsonify(all_Fires)


@app.route("/api/v1.0/firedata")
def firedata():
    # Create our session (link) from Python to the DB
    session = Session(engine)

#"""Return a list of bushfire Acquisition date, fire radiative power (FRP), latidude, longitude"""
# Query all fires
    results = session.query(Firedata.acq_date, Firedata.frp, Firedata.latitude,Firedata.longitude).filter((Firedata.latitude >= -13.30881220) & (Firedata.latitude < -35.101726)).filter((Firedata.longitude <= 128.99605605) & (Firedata.longitude > 112.90096733))

    session.close()

    # Create a dictionary from the row data and append to a list of fires in the Western australia
    all_locations = []
    for acq_date, frp, latitude, longitude in results:
        fireLocs_dict = {}
        fireLocs_dict["acq_date"] = acq_date
        fireLocs_dict["frp"] = frp
        fireLocs_dict["latitude"] = latitude
        fireLocs_dict["longitude"] = longitude    
        all_locations.append(fireLocs_dict)

    return jsonify(all_locations)          

if __name__ == '__main__':
    app.run()