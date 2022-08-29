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

import React, {Component} from 'react';
import MapView from "./MapView";
import BuildingPicker from "./BuildingPicker";
import "./App.css";

export interface Part {
    x1: number;     // x coordinate of the first point
    y1: number;     // y coordinate of the first point
    x2: number;     // x coordinate of the second point
    y2: number;     // y coordinate of the second point
}

interface AppState {
    path: Part[];   // one path could consist of many small parts
}

class App extends Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            path: []
        };
    }

    drawPath = (newPath: Part[]) => {
        this.setState({ path: newPath });
    };

    render() {
        return (
            <div id="whole-page">
                <h1>UW CampusPath finding Tools</h1>
                <BuildingPicker onChange={this.drawPath}/>
                <MapView path={this.state.path}/>
            </div>
        );
    }

}

export default App;
