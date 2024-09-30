# Object Inspector Module

## Overview

The Object Inspector module is responsible for displaying the information of the selected object in the trace.

## Implementation 1 : Object Inspector Panel

The Object Inspector panel will be located on the right side or the bottom of the page. The currently selected object will be highlighted in the trace in order to show the user which object is being inspected. The Object Inspector panel will display the following information:
- Type
- Name
- Value of the different fields

## Implementation 2 : Object History Panel

The Object History panel will be located on the right side or the bottom of the page. The Object History panel will display the history of the selected object. The user will be able to see the different values of the object fields at different points in time and will be able to retrieve the moment in the trace where the object was modified to this state. Clicking on an object at a specific point in the trace will open is History panel and highlight his state at this point in the History. Inversely, clicking on an object in the History panel will highlight the object in the trace.
