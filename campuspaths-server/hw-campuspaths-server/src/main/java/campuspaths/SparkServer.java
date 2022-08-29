/*
 * Copyright (C) 2021 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2021 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

package campuspaths;

import campuspaths.utils.CORSFilter;
import com.google.gson.Gson;
import pathfinder.CampusMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

import java.util.Map;

public class SparkServer {

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        // The above two lines help set up some settings that allow the
        // React application to make requests to the Spark server, even though it
        // comes from a different server.
        // You should leave these two lines at the very beginning of main().

        // Initialize one CampusMap for the server
        CampusMap UWMap = new CampusMap();

        /*
            returns all the building names on the map in json form
            ROUTE: /buildings
         */
        Spark.get("/buildings", (req, res) -> {
            if (res == null) {
                Spark.halt(400, "Error when list buildings");
            }
            Gson gson = new Gson();
            return gson.toJson(UWMap.buildingNames());
        });

        /*
            gets the path from a building to another by using dijkstra's algorithm
            ROUTE: /findPath?start=<BUILDING-SHORTNAME>&dest=<BUILDING-SHORTNAME>
         */
        Spark.get("findPath", (req, res) -> {
            String sourceNode = req.queryParams("start");
            String destNode = req.queryParams("dest");
            if (sourceNode == null || destNode == null) {
                Spark.halt(400, "Must have start and dest node");
            }
            String ret = "";
            try {
                Path<Point> path = UWMap.findShortestPath(sourceNode, destNode);
                Gson gson = new Gson();
                ret =  gson.toJson(path);
            } catch(IllegalArgumentException e) {
                Spark.halt(400, "Must provide valid building abbreviation");
            }
            return ret;
        });
    }

}
