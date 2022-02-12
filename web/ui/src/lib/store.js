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
    Route: '',
    Paths: [],
    Views: [],
    ViewSelect: ''
});

export const routeViewState = writable ({
});


export function getProfileStateKey (group, name) {
    return '/profile/'+group+'/'+name;
}