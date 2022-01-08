import {writable} from 'svelte/store';

export const selectedNode = writable('');

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


