# Search Module

## Overview

The Search module is responsible for searching the database for objects/source code that match a given query.
The main difficulty is to handle multiple search results and display them in a user-friendly way.

## Implementation 1 : Search Bar

The search bar is located in the header of the page.
For example, the user can search for a specific object by its name, or search for a specific field by its name.
Usage example : object1.field1==value1, object2.field2>=value2

## Implementation 2 : Search Dropdown

The search dropdown is located in the header of the page.
It consists of a dropdown menu that contains a list of all the objects in the trace.
After selecting an object from the dropdown menu, the user can enter a search query with other dropdown menus to search for a specific field in the selected object.

## Implementation 3 : Search Button

The search button is located in the header of the page.
When the user clicks on the search button, the search bar will be displayed, and the user can enter the search query in a popup window.