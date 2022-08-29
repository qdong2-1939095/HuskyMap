import React, {Component} from 'react';
import {Part} from './App';
import "./BuildingPicker.css";

export interface BuildingName {
    longName: string;
    shortName: string;
}

interface BuildingPickerProps {
    onChange(path: Part[]): void;
}

interface BuildingPickerState {
    startBuilding: string;
    destBuilding: string;
    buildingList: BuildingName[];   // a list contains all the building name pairs of (longName, shortName)
}

/**
 * Contains all the UI for BuildingPicker, which has two drop-down button for user to choose the start building and
 * destination building which user wants to find path between them. Also contains draw and clear button which could
 * let user to draw or clear path
 */
class BuildingPicker extends Component<BuildingPickerProps, BuildingPickerState> {
    constructor(props: BuildingPickerProps) {
        super(props);
        this.state = {
            startBuilding: "",
            destBuilding: "",
            buildingList: []
        };
    }

    /**
     * fetch all buildings only once when web page finish loading
     */
    componentDidMount() {
        this.fetchBuildings();
    }

    /**
     * fetch a list of all buildings in map from the server
     */
    fetchBuildings = async() => {
        try {
            let response: Response = await fetch("http://localhost:4567/buildings");
            if (!response.ok) {
                alert("There is an error: " + new Error(await response.text()).message);
            }
            let parsedBuildingList: any = await response.json();
            let buildingList: BuildingName[] = [];
            for (let buildingShortName in parsedBuildingList) {
                let newBuildingName: BuildingName = {longName: "", shortName: ""};
                newBuildingName.longName = parsedBuildingList[buildingShortName];
                newBuildingName.shortName = buildingShortName;
                buildingList.push(newBuildingName);
            }
            const sortedBuildingList = buildingList.sort((n1, n2) => {
                const name1 = n1.shortName;
                const name2 = n2.shortName;
                if (name1 > name2) { return 1; }
                if (name1 < name2) { return -1; }
                return 0;
            });
            this.setState({ buildingList: sortedBuildingList });
        } catch (error) {
            alert(error);
        }
    };

    /**
     * update the start building when user click to choose a dest building
     */
    startBuildingSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({startBuilding: event.target.value});
    };

    /**
     * update the destination building when user click to choose a dest building
     */
    destBuildingSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({destBuilding: event.target.value});
    };

    /**
     * let parent draw the shortest path between two buildings on the map
     */
    drawPath = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.fetchPath();
    };

    /**
     * fetch the shortest path between two buildings on the map from the server, then let parent draw that shortest path
     */
    fetchPath = async() => {
        try {
            const start: string = this.state.startBuilding;
            const dest: string = this.state.destBuilding;
            if (start.length > 0 && dest.length > 0) { // if both start building and dest building are selected
                if (start === dest) {
                    alert("Please select different start and dest Building.");
                }
                const route: string = "http://localhost:4567/findPath?start=" + start + "&dest=" + dest;
                let response: Response = await fetch(route);
                if (!response.ok) {
                    alert("There is an error: " + await response.text());
                }
                let parsedPath: any = await response.json();
                let path: Part[] = [];
                for (let part of parsedPath.path) {
                    const point1: any = part.start;
                    const point2: any = part.end;
                    let newPart: Part = {x1: 0, y1: 0, x2: 0, y2: 0};
                    newPart.x1 = point1.x;
                    newPart.y1 = point1.y;
                    newPart.x2 = point2.x;
                    newPart.y2 = point2.y;
                    path.push(newPart);
                }
                this.props.onChange(path);  // let app.tsx know there is a new path
            } else {
                alert("Please select both start building and destination building.");
            }
        } catch (error) {
            alert(error);
        }
    };

    /**
     * let parent to make drop-down button to default and clear the path in map
     */
    clear = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            startBuilding: "",
            destBuilding: ""
        });
        const path: Part[] = [];
        this.props.onChange(path);
    };

    render() {
        const allBuildings: BuildingName[] = this.state.buildingList;
        let choices: JSX.Element[] = [];
        for (let building of allBuildings) {
            choices.push(<option key={building.shortName} value={building.shortName}>
                {"(" + building.shortName + "): " + building.longName}</option>);
        }
        return (
            <div>
                <h2>Select a start building and a destination building to find the shortest path between them!</h2>
                Start Building:
                <select onChange={this.startBuildingSelect}
                        value={this.state.startBuilding}><option value="">Select a building</option>
                    {choices}
                </select>
                Destination Building:
                <select onChange={this.destBuildingSelect} value={this.state.destBuilding}>
                    <option value="">Select a building</option>
                    {choices}
                </select>
                <br />
                <button id="find" onClick={this.drawPath}>Find Shortest Path</button>
                <button id="clear" onClick={this.clear}>Clear Existing Path</button>
            </div>
        );
    }
}

export default BuildingPicker;
