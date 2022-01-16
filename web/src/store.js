import {writable} from 'svelte/store';

export const selectedNode = writable({
    Name: '',
    ParentName: '', 
    Type: '',
});

export const nodeTreeRoot = writable({
    Name: 'Traffic Nodes',
    expanded: false,
    MenuItems: ['Error!'],
    children: []
});

export const profileTreeRoot = writable({
    Name: 'Traffic Profiles',
    expanded: false,
    MenuItems: ['Error!'],
    children: []
});

export const navRoute = writable ({
    Paths: [],
    Views: [],
    ViewSelect: ''
});
